exports = module.exports;
var db     = require('../../models'),
    _      = require('underscore'),
    crypto = require('crypto'),
    CONF   = require('config'),
    async  = require('async'),
    hash   = function hash(pwd, salt, fn) {
        var len         = CONF.app.auth.bytesize,
            iterations  = CONF.app.auth.iterations;

        if (3 == arguments.length) {
            crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
                fn(err, hash.toString('base64'));
            });
        } else {
            fn = salt;
            crypto.randomBytes(len, function(err, salt){
                if (err) return fn(err);
                salt = salt.toString('base64');
                crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
                    if (err) return fn(err);
                    fn(null, salt, hash.toString('base64'));
                });
            });
        }
    };

exports.hash = hash;

exports.login = function(req, res) {
    res.render('../core/auth/views/login', {});
};

exports.authenticate = function authenticate(req, res) {
    var email   = req.body.email,
        pass    = req.body.password;

    if (CONF.app.auth.passthrough && (CONF.app.auth.passthrough.email == email && CONF.app.auth.passthrough.pass == pass)) req.session.regenerate(function(){
        async.auto({
            type: function(next) {
                db.Type.findAll({
                    where: {deleted: 0},
                    attributes: ['id', 'name', 'icon']
                }).complete(next);
            },
            permission: function(next) {
                db.Permission.findAll({
                    attributes: ['id', 'name', 'uri', 'action']
                }).complete(next);
            }
        }, function(err, results) {
            if (!err) {
                req.session.cookie.maxAge = 604800000;
                req.session.user = {
                    email: email,
                    name: 'sysadmin',
                    deleted: 0,
                    types: results.type,
                    permissions: results.permission
                };
                req.session.success = 'Login Pass-through for sysadmin';
                res.redirect('/dashboard/index');
            }
        });
    });
    else async.auto({
        user: function(next) {
            db.User.find({
                include: [{
                    model: db.Group,
                    include: [
                        db.Type,
                        db.Permission
                    ]
                }],
                where: { email: email, deleted: 0 }
            }).complete(next);
        },
        status: function(next) {
            db.Stage.findAll({
                attributes: ['id', 'name', 'deleted']
            }).complete(next);
        }
    }, function(err, results) {
        if (!err) {
            var user = results.user;
            if (!user || !user.id) {
                res.locals.error = 'No User found for ' + email;
                res.render('../core/auth/views/login');
            } else {
                hash(pass, user.salt, function(err, hash){
                    if (err) throw new Error(err);
                    if (hash == user.password){
                        req.session.regenerate(function(){
                            req.session.site_title = 'node-tickets';
                            req.session.cookie.maxAge = 604800000;
                            req.session.recordData = {
                                status: results.status
                            };
                            req.session.user = {
                                id: user.id,
                                email: email,
                                name: user.name,
                                deleted: user.deleted,
                                group: user.group.name,
                                groupId: user.group.id,
                                permissions: user.group.permissions,
                                types: user.group.types
                            };
                            req.session.success = 'Welcome ' + user.name;
                            res.redirect('/dashboard/index');
                        });
                    } else {
                        res.locals.error = 'Sorry ' + user.name + '. Did you forget your password?';
                        res.render('../core/auth/views/login');
                    }
                });
            }
        }
    });
};

exports.forgotten = function(req, res) {
    res.locals.info = 'not yet implemented';
    res.render('../core/auth/views/login', {});
};
exports.sendPassword = function(req, res) {
    res.locals.info = 'not yet implemented';
    res.render('../core/auth/views/login', {});
};
exports.register = function(req, res) {
    var params = req.body;
        params.GroupId = 2;
        params.deleted = 0;
    hash(params.password, function(err, salt, hash){
        if (err) next(err);
        params.password = hash;
        params.salt = salt;
        db.User.build(params)
            .save()
            .success(function(user) {
                res.locals.success = 'Created User: '+ user.name;
                res.render('../core/auth/views/login', {});
            }).error(function(err) {
                res.locals.error = '';
                if (err.code && 'ER_DUP_ENTRY' === err.code) res.locals.error = 'There is already another user with email: ' + params.email;
                else if (err.email && 'Validation contains failed' === err.email[0]) res.locals.error = 'Only emails within domain [' + CONF.app.auth.domain + '] allowed.';
                else if (err) _.forEach(err,function(v,k){
                    res.locals.error += k +': ' + v;
                });
                console.log(res.locals.error);
                res.render('../core/auth/views/login', {});
            });
    });
};
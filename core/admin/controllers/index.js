exports = module.exports;
var _       = require('underscore'),
    CONF    = require('config'),
    db      = require('../../models'),
    async   = require('async'),
    hash    = require('../../auth/').callbacks.auth.hash;

exports.showAll = function(req, res) {
    async.auto({
        user: function(next) {
            db.User.findAll({
                include: [db.Group]
            }).complete(next);
        },
        group: function(next) {
            db.Group.findAll({
                include: [db.Type,db.Permission]
            }).complete(next);
        },
        type: function(next) {
            db.Type.findAll({
                where: {deleted: 0},
                attributes: ['id', 'name', 'icon']
            }).complete(next);
        },
        permission: function(next) {
            db.Permission.findAll({
                attributes: ['id', 'name', 'action']
            }).complete(next);
        }
    }, function(err, results) {
        if (err) {
            res.render('error', {
                err: err,
                message: 'Database Error'
            });
            return;
        }
        var context = {
            title:          'Admin Area',
            pageActive:     'Admin',
            breadcrumb:     {},
            title_users:    'Users',
            title_groups:   'Groups',
            users:          results.user,
            groups:         results.group,
            permissions:    results.permission,
            types:          results.type
        }
        res.render('../core/admin/views/index', context);
    });
};

exports.createUser = function(req, res) {
    var params = req.body;
    async.parallel({
        hash: function(next) {
            hash(params.password, function(err, salt, hash){
                if (err) next(err);
                params.password = hash;
                params.salt = salt;
                next();
            });
        }
    }, function(err) {
        if (!err) {
            db.User.build(params).save().success(function(user) {
                if (res.locals.session.user.id) db.Audit.build({
                    action: 'create',
                    UserId: res.locals.session.user.id,
                    action_date: (new Date()).toISOString(),
                    table: 'User',
                    table_pk: user.id
                }).save();
                req.session.success = 'Created User: ' + user.name;
                res.redirect('/admin/index');
            }).error(function(err) {
                req.session.error = '';
                if (err.code && 'ER_DUP_ENTRY' === err.code) req.session.error = 'There is already another user with email: ' + params.email;
                else if (err.email && 'Validation contains failed: email' === err.email[0]) req.session.error = 'Only emails within domain [' + CONF.app.auth.domain + '] allowed.';
                else if (err) _.forEach(err,function(v,k){
                    req.session.error += k +': ' + v;
                });
                console.log(req.session.error);
                res.redirect('/admin/index');
            });
        }
    });
};

exports.createGroup = function(req, res) {
    var params = req.body;
    db.Group.build(params).save().success(function(group){
        if (res.locals.session.user.id) db.Audit.build({
            action: 'create',
            UserId: res.locals.session.user.id,
            action_date: (new Date()).toISOString(),
            table: 'Group',
            table_pk: group.id
        }).save();
        async.auto({
            type: function(next) {
                db.Type.findAll({
                    where: { id: params.types },
                    attributes: ['id']
                }).complete(next);
            },
            permission: function(next) {
                db.Permission.findAll({
                    where: { id: params.permissions },
                    attributes: ['id']
                }).complete(next);
            }
        }, function(err, results) {
            if (!err) {
                group.setTypes(results.type).success(function(){
                    group.setPermissions(results.permission).success(function(){
                        db.Group.find({
                            where: { id: group.id },
                            include: [db.Type,db.Permission]
                        }).success(function(savedGroup){
                            req.session.success = 'Created Group: ' + savedGroup.name;
                            res.redirect('/admin/index');
                        });
                    });
                });
            }
        });
    }).error(function(err) {
        req.session.error = '';
        if (err.code && 'ER_DUP_ENTRY' === err.code) req.session.error = 'There is already another ' + params.name + ' group';
        else if (err) _.forEach(err,function(v,k){
            req.session.error += k +': ' + v;
        });
        console.log(req.session.error);
        res.redirect('/admin/index');
    });

};
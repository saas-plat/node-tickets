exports = module.exports;
var db = require('../models'),
    async = require('async');

exports.messages = function messages(req, res, next){
    var err = req.session.error,
        msg = req.session.success;
    delete req.session.error;
    delete req.session.success;

    res.locals.session = req.session;

    if (err) res.locals.error = err;
    if (msg) res.locals.success = msg;
    next();
};

exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Please Login';
        res.redirect('/auth/login');
    }
};

exports.refreshData = function refreshData(req, res, callback) {
    if (req.session.user.id) async.auto({
        user: function(next) {
            db.User.find({
                include: [{
                    model: db.Group,
                    include: [
                        db.Type,
                        db.Permission
                    ]
                }],
                where: { id: req.session.user.id }
            }).complete(next);
        },
        stage: function(next) {
            db.Stage.findAll({
                attributes: ['id', 'name']
            }).complete(next);
        },
        resolution: function(next) {
            db.Resolution.findAll({
                attributes: ['id', 'name']
            }).complete(next);
        },
        module: function(next) {
            db.Module.findAll({
                attributes: ['id', 'name']
            }).complete(next);
        },
        priority: function(next) {
            db.Priority.findAll({
                attributes: ['id', 'name']
            }).complete(next);
        },
        type: function(next) {
            db.Type.findAll().complete(next);
        }
    }, function(err, results) {
        if (err) callback(err);
        var user = results.user,
            types = [],
            stage = [],
            resolution = [],
            modules = [],
            priority = [];
        results.stage.forEach(function(v){
            stage.push({
                id: v.id,
                text: v.name
            });
        });
        results.resolution.forEach(function(v){
            resolution.push({
                id: v.id,
                text: v.name
            });
        });
        results.module.forEach(function(v){
            modules.push({
                id: v.id,
                text: v.name
            });
        });
        results.priority.forEach(function(v){
            priority.push({
                id: v.id,
                text: v.name
            });
        });
        req.session.recordData = {
            types: results.type,
            stage: stage,
            module: modules,
            priority: priority
        };
        req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            deleted: user.deleted,
            group: user.group.name,
            groupId: user.group.id,
            permissions: user.group.permissions,
            types: user.group.types
        };
        callback();
    });
    else callback();
};


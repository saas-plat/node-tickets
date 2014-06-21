exports = module.exports;
var db = require('../../models'),
    async = require('async');

exports.getUserRecords = function(req, res) {
    async.auto({
        task: function(next) {
            db.Type.find({
                where: { name : "Task" }
            }).complete(next);
        },
        tasks: function(next) {
            db.Record.findAll({
                where: {
                    'user.id': req.params.id,
                    'type.name' : "Task"
                },
                include: [{
                    model: db.Type
                },{
                    model: db.Stage
                },{
                    model: db.Resolution
                },{
                    model: db.Module
                },{
                    model: db.Priority
                },{
                    model: db.User,
                    attributes: ['id', 'name']
                }]
            }).complete(next);
        },
        issue: function(next) {
            db.Type.find({
                where: { name : "Issue" }
            }).complete(next);
        },
        issues: function(next) {
            db.Record.findAll({
                where: {
                    'user.id': req.params.id,
                    'type.name' : "Issue"
                },
                include: [{
                    model: db.Type
                },{
                    model: db.Stage
                },{
                    model: db.Resolution
                },{
                    model: db.Module
                },{
                    model: db.Priority
                },{
                    model: db.User,
                    attributes: ['id', 'name']
                }]
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
        var types = [];
        results.task.dataValues.records = results.tasks;
        results.issue.dataValues.records = results.issues;
        types.push(results.task);
        types.push(results.issue);
        var json = JSON.stringify(types);
        res.setHeader('Content-Type', 'application/json');
        res.render('json', { layout: false, data: json });
    });
};
exports.getRecordType = function(req, res) {
    async.auto({
        type: function(next) {
            db.Type.find({
                where: {
                    name: req.params.name
                }
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
        var json = JSON.stringify(results.type);
        res.setHeader('Content-Type', 'application/json');
        res.render('json', { layout: false, data: json });
    });
};
exports.getRecordTypes = function(req, res) {
    async.auto({
        types: function(next) {
            db.Type.findAll().complete(next);
        }
    }, function(err, results) {
        if (err) {
            res.render('error', {
                err: err,
                message: 'Database Error'
            });
            return;
        }
        var json = JSON.stringify(results.types);
        res.setHeader('Content-Type', 'application/json');
        res.render('json', { layout: false, data: json });
    });
};

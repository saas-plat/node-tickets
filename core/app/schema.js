var db = require('../models')
    async = require('async');

var insertTypes = function(){
    db.Type.build({
        name: 'Issue',
        icon: 'glyphicon glyphicon-warning-sign'
    }).save();
    db.Type.build({
        name: 'Task',
        icon: 'glyphicon glyphicon-list-alt'
    }).save();
    db.Type.build({
        name: 'Bug',
        icon: 'glyphicon glyphicon-flash'
    }).save();
    db.Type.build({
        name: 'RFC',
        icon: 'glyphicon glyphicon-leaf'
    }).save();
    db.Type.build({
        name: 'Enhancement',
        icon: 'fui-cmd'
    }).save();
    db.Type.build({
        name: 'Milestone',
        icon: 'glyphicon glyphicon-road'
    }).save();
    db.Type.build({
        name: 'Release',
        icon: 'glyphicon glyphicon-transfer'
    }).save();
    db.Type.build({
        name: 'Project',
        icon: 'glyphicon glyphicon-briefcase'
    }).save();
};
var insertPermissions = function(){
    db.Permission.build({
        name: '<i class="glyphicon glyphicon-cog"></i> Configure',
        uri: '/admin/config',
        action: false
    }).save();
    db.Permission.build({
        name: '<i class="glyphicon glyphicon-wrench"></i> Admin',
        uri: '/admin/index',
        action: false
    }).save();
    db.Permission.build({
        name: '<i class="glyphicon glyphicon-bell"></i> Audit',
        uri: '/audit/log',
        action: false
    }).save();
    db.Permission.build({
        name: 'Create User',
        uri: null,
        action: true
    }).save();
    db.Permission.build({
        name: 'Create Group',
        uri: null,
        action: true
    }).save();
};
var insertGroups = function(){
    db.Group.build({
        name: 'Super Admin'
    }).save()
    .success(function(group){
        async.auto({
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
            if (!err) {
                group.setTypes(results.type);
                group.setPermissions(results.permission);
            }
        });
    });
    db.Group.build({
        name: 'User'
    }).save();
};
var insertStage = function(){
    db.Stage.build({
        name: 'Open',
        system: true
    }).save();
    db.Stage.build({
        name: 'In Progress',
        system: true
    }).save();
    db.Stage.build({
        name: 'Resolved',
        system: true
    }).save();
    db.Stage.build({
        name: 'Reopened',
        system: true
    }).save();
    db.Stage.build({
        name: 'Closed',
        system: true
    }).save();
};
var insertResolution = function(){
    db.Resolution.build({
        name: 'Unresolved'
    }).save();
    db.Resolution.build({
        name: 'No Fix'
    }).save();
    db.Resolution.build({
        name: 'Non-Issue'
    }).save();
    db.Resolution.build({
        name: 'Fixed'
    }).save();
    db.Resolution.build({
        name: 'Released'
    }).save();
    db.Resolution.build({
        name: 'Complete'
    }).save();
    db.Resolution.build({
        name: 'Rejected'
    }).save();
};
var insertModule = function(){
    db.Module.build({
        name: 'Core'
    }).save();
    db.Module.build({
        name: 'Authentication'
    }).save();
    db.Module.build({
        name: 'UI'
    }).save();
    db.Module.build({
        name: 'Administration'
    }).save();
    db.Module.build({
        name: 'Profile'
    }).save();
};
var insertPriority = function(){
    db.Priority.build({
        name: 'Critical'
    }).save();
    db.Priority.build({
        name: 'High'
    }).save();
    db.Priority.build({
        name: 'Normal'
    }).save();
    db.Priority.build({
        name: 'Low'
    }).save();
};

module.exports = function(req,res){
    db.sequelize
    .sync({ force: true })
    .complete(function(err) {
        if (err) throw err;
        insertTypes();
        insertPermissions();
        insertGroups();
        insertStage();
        insertResolution();
        insertModule();
        insertPriority();
    });
    res.redirect('/auth/login');
}
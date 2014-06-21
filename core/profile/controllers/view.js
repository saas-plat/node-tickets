exports = module.exports;
var db      = require('../../models');

exports.showUser = function(req, res) {
    var context = {
        title:      'User Profile',
        pageActive: 'Profile',
        breadcrumb: {}
    }
    db.User.find({
        where: { id: req.params.id },
        include: [db.Group]
    }).success(function(user) {
        if (req.session.user.id && req.params.id != req.session.user.id) db.Audit.build({
            action: 'view',
            UserId: res.locals.session.user.id,
            action_date: (new Date()).toISOString(),
            table: 'User',
            table_pk: user.id
        }).save();
        context.user = user;
        res.render('../core/profile/views/view', context);
    }).error(function(err) {
        res.render('error', {
            err: err,
            message: 'Database Error'
        });
    });
};
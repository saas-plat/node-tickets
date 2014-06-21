exports = module.exports;
var db      = require('../../models');

exports.showAll = function(req, res) {
    db.Audit.findAll({
        include: [db.User]
    }).success(function(audits) {
        res.render('../core/audit/views/index', {
            title: 'Audit Log',
            pageActive: 'Audit',
            breadcrumb: { Admin: '/admin/index' },
            rows: audits
        });
    }).error(function(err) {
        res.render('error', {
            err: err,
            message: 'Database Error'
        });
    });
};
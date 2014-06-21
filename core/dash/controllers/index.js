exports = module.exports;

exports.showAll = function(req, res) {
    res.render('../core/dash/views/index', {
        title:      'Dashboard',
        pageActive: 'Dashboard',
        breadcrumb: { Profile: (req.session.user.id ? ('/profile/' + req.session.user.id) : '/dashboard/index') }
    });
};
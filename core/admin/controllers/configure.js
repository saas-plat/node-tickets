exports = module.exports;
var db = require('../../models'),
    extend = require('util')._extend,
    foreach = require('util')._each;

exports.showTypes = function(req, res) {
    //res.locals.info = 'not yet implemented';
    var context = {
        title:          'Configure Records',
        pageActive:     'Configure',
        breadcrumb:     { Admin: '/admin/index'}
    }
    res.render('../core/admin/views/configure', context);
};
exports.saveType = function(req, res) {
    var error = function(err){
            res.locals.error = err;
            res.redirect('/admin/config');
        },
        properties = {},
        fields = db.Type.getDefinition();

    db.Type.find(req.body.TypeId).success(function(type){
        Object.keys(fields).forEach(function(index) {
            if (['TypeId','id'].indexOf(index) === -1)
            this[index] = (req.body.hasOwnProperty(index) ? req.body[index] : ('TINYINT(1)' === fields[index].type ? 0 : type[index] || null ));
        }, properties);

        if (type) type.updateAttributes(properties).success(function(){
            req.session.success = 'Saved ' + type.name;
        }).error(function(err){
            error(err);
        });
        error('type not found');
    }).error(function(err){
        error(err);
    });
};
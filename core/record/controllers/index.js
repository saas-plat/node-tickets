exports = module.exports;

exports.showRecord = function(req, res) {
    res.locals.info = 'not yet implemented';
    res.render('../core/record/views/index', {});
};
exports.search = function(req, res) {
    res.locals.info = 'not yet implemented';
    res.render('../core/record/views/index', {});
};
exports.create = function(req, res) {
    console.log(req.body);
    res.locals.info = 'not yet implemented';
    res.render('../core/record/views/index', {});
};

var express = require('express'),
    app = exports = module.exports = express(),
    middleware = require('../app/middleware');

exports.callbacks = {
    index: require('./controllers/index'),
    records: require('./controllers/records')
};

app.get('/view/:RecordId', middleware.ensureAuthenticated, middleware.refreshData, exports.callbacks.index.showRecord);
app.get('/search/:term', middleware.ensureAuthenticated, middleware.refreshData, exports.callbacks.index.search);
app.post('/create/:TypeId', middleware.ensureAuthenticated, exports.callbacks.index.create);
// AJAX calls
app.get('/list/:id', middleware.ensureAuthenticated, middleware.refreshData, exports.callbacks.records.getUserRecords);
app.get('/type/:name', middleware.ensureAuthenticated, middleware.refreshData, exports.callbacks.records.getRecordType);
app.get('/types', middleware.ensureAuthenticated, middleware.refreshData, exports.callbacks.records.getRecordTypes);


//-- You could also serve templates with local paths, but using shared layouts and partials may become tricky
//var hbs = require('hbs');
//app.set('views', __dirname + '/views');
//app.set('view engine', 'handlebars');
//app.engine('handlebars', hbs.__express);
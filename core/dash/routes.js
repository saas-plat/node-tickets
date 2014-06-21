var express     = require('express'),
    app         = exports = module.exports = express(),
    middleware = require('../app/middleware');

exports.callbacks = {
    index: require('./controllers/index')
};

app.get('/index', middleware.ensureAuthenticated, middleware.refreshData, exports.callbacks.index.showAll);

//-- You could also serve templates with local paths, but using shared layouts and partials may become tricky
//var hbs = require('hbs');
//app.set('views', __dirname + '/views');
//app.set('view engine', 'handlebars');
//app.engine('handlebars', hbs.__express);
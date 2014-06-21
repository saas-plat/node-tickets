var express = require('express'),
    app = exports = module.exports = express(),
    middleware = require('../app/middleware');

exports.callbacks = {
    view: require('./controllers/view')
};

app.get('/:id', middleware.ensureAuthenticated, middleware.refreshData, exports.callbacks.view.showUser);

//-- You could also serve templates with local paths, but using shared layouts and partials may become tricky
//var hbs = require('hbs');
//app.set('views', __dirname + '/views');
//app.set('view engine', 'handlebars');
//app.engine('handlebars', hbs.__express);
var express = require('express'),
    app = exports = module.exports = express(),
    middleware = require('../app/middleware');

exports.callbacks = {
    index: require('./controllers/index'),
    configure: require('./controllers/configure')
};

app.get('/index', middleware.ensureAuthenticated, middleware.refreshData, exports.callbacks.index.showAll);
app.post('/user', middleware.ensureAuthenticated, exports.callbacks.index.createUser);
app.post('/group', middleware.ensureAuthenticated, exports.callbacks.index.createGroup);
app.get('/config', middleware.ensureAuthenticated, exports.callbacks.configure.showTypes);
app.post('/config', middleware.ensureAuthenticated, exports.callbacks.configure.saveType);

//-- You could also serve templates with local paths, but using shared layouts and partials may become tricky
//var hbs = require('hbs');
//app.set('views', __dirname + '/views');
//app.set('view engine', 'handlebars');
//app.engine('handlebars', hbs.__express);
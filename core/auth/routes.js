var _ = require('underscore')
  , express = require('express')
  , app = exports = module.exports = express();

exports.callbacks = {
    auth: require('./controllers/auth')
};

app.get('/login', exports.callbacks.auth.login);
app.post('/login', exports.callbacks.auth.authenticate);
app.get('/forgotten', exports.callbacks.auth.sendPassword);
app.post('/forgotten', exports.callbacks.auth.sendPassword);
app.post('/register', exports.callbacks.auth.register);


//-- You could also serve templates with local paths, but using shared layouts and partials may become tricky
//var hbs = require('hbs');
//app.set('views', __dirname + '/views');
//app.set('view engine', 'handlebars');
//app.engine('handlebars', hbs.__express);
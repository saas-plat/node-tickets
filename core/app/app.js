exports = module.exports;
var express    = require('express'),
    log        = require('metalogger')(),
    hbs        = require('hbs'),
    ClusterStore = require('strong-cluster-connect-store')(express),
    CONF       = require('config'),
    viewHelper = require('./hbsHelpers'),
    appTools   = require('./middleware');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

exports.setup = function(app) {

  app.use(express.compress());

  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.engine('hbs', hbs.__express);

  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(methodOverride());
  app.use(express.query());
  app.use(cookieParser(CONF.app.cookie_secret));
  app.use(express.session({ secret: CONF.app.session_secret, key: 'connect.sid', store: new ClusterStore() }));
  viewHelper.loadCoreHelpers();
  //app.use(express.responseTime());

  // Session-persisted message middleware
  app.use(appTools.messages);

  // This is not needed if you handle static files with, say, Nginx (recommended in production!)
  // Additionally you should probably pre-compile your LESS stylesheets in production
  // Last, but not least: Express' default error handler is very useful in dev, but probably not in prod.
  if (('NODE_SERVE_STATIC' in process.env) && process.env['NODE_SERVE_STATIC'] == 1) {
    var pub_dir = CONF.app.pub_dir;
    if (pub_dir[0] != '/') { pub_dir = '/' + pub_dir; } // humans are forgetful
    var root_dir = require('path').dirname(module.parent.filename);
    pub_dir = root_dir + pub_dir;

    //app.use(require('less-middleware')({ src: pub_dir }));
    app.use(express.static(pub_dir));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  }

    //---- ensure login
    // 移除到install.js
    //app.use('/setup', require('./schema'));

    //---- ensure login
    app.get('/', function(req, res){
        res.redirect('/auth/login');
    });
    app.get('/logout', function(req, res){
        req.session.destroy(function(){
            res.redirect('/auth/login');
        });
    });

    //---- Mounting application modules
    app.use('/auth', require('../auth'));
    app.use('/dashboard', require('../dash'));
    app.use('/record', require('../record'));
    app.use('/admin', require('../admin'));
    app.use('/profile', require('../profile'));
    app.use('/audit', require('../audit'));

    //--- End of Internal modules

  //-- ATTENTION: make sure app.router and errorHandler are the very last two app.use() calls
  //-- ATTENTION: and in the sequence they are in, or it won't work!!!
  app.use(app.router);

  // Catch-all error handler. Modify as you see fit, but don't overuse.
  // Throwing exceptions is not how we normally handle errors in Node.
  app.use(function catchAllErrorHandler(err, req, res, next){
    // Emergency: means system is unusable
    log.emergency(err.stack);
    res.send(500);

    // We aren't in the business of hiding exceptions under the rug. It should
    // still crush the process. All we want is: to properly log the error before
    // that happens.
    //
    // Clustering code in the clustering module will restart the crashed process.
    // Make sure to always run clustering in production!
    setTimeout(function() { // Give a chance for response to be sent, before killing the process
      process.exit(1);
    }, 10);
  });
};


/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoF = require('./routes/mongoF')
  , funct = require('./routes/functions')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//ROUTING PLAN
//// CORE
////// GET
app.get('/', routes.index);

app.get('/dashboard', routes.dashboard);
app.get('/upload', routes.upload);
app.get('/settings', routes.settings);
app.get('/statistic', routes.statistic);
app.get('/profil', routes.profil);
app.get('/adminUser', routes.adminUser);
app.get('/adminReq', routes.adminReq);
app.get('/adminSett', routes.adminSett);
app.get('/adminLang', routes.adminLang);

app.get('*/logout', routes.logout);

////// POST
app.post('*/logHack', routes.logHack);
app.post('*/registrate', funct.registrate);
app.post('*/login', funct.login);
app.post('*/imageUpload', funct.imageUpload);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

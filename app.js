
/**
 * Module dependencies.
 */

var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , routes = require('./routes')
  , mongoF = require('./routes/mongoF')
  , funct = require('./routes/functions')
  , paypal = require('./routes/paypal')
  , prod = require('./routes/product')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
}

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
  app.use(stylus.middleware({src:__dirname + '/public', compile: compile}));
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
app.get('/albums', routes.albums);
app.get('/settings', routes.settings);
app.get('/statistic', routes.statistic);
app.get('/profil', routes.profil);
app.get('/adminUser', routes.adminUser);  //  /adminUser/1 => 1-10 (page nr)
app.get('/adminReq', routes.adminReq);
app.get('/adminSett', routes.adminSett);
app.get('/adminLang', routes.adminLang);
app.get('/adminNews', routes.adminNews);

app.get('/paypal/:sec', paypal.backFromPP);

//app.get('/bla', mongoF.populateDB)

app.get('*/logout', routes.logout);

////// POST
app.post('*/logHack', routes.logHack);
app.post('*/registrate', funct.registrate);
app.post('*/login', funct.login);
app.post('*/imageUpload', funct.imageUpload);
app.post('*/submitPass', funct.submitPass);
app.post('*/submitContact', funct.submitContact);
app.post('*/submitBank', funct.submitBank);
app.post('*/submitPref', funct.submitPref);

app.post('*/removeSong', funct.removeSong);
app.post('*/uplAlbInfo', funct.uplAlbInfo);
app.post('*/uploadWav', funct.uploadWav);
app.post('*/uploadWavInfo', funct.uplWavInfo);
app.post('*/addArtist', funct.addArtist);
app.post('*/uploadPaymentInfo', funct.uploadPaymentInfo);
app.post('*/calcPrice', funct.calcPrice);
app.post('*/editArtist', funct.editArtist);
app.post('*/useVoucher', mongoF.useVoucher);


app.post('*/sendRequest', mongoF.writeRequest);



app.post('*/paypal', paypal.pay);

//// Admin
////// GET
app.get('/delNews/:asd', mongoF.deleteNews);
app.get('/getJSON/:user/:asd', funct.getJSON);
app.get('/approveAlb/:user/:asd', funct.approveAlb);
app.get('/downloadAlb/:user/:asd', prod.create_product);
app.get("/createVoucher", mongoF.createVoucher);

app.get('/downloadAlbum/:ean', prod.dlProduct);

////// POST
app.post('*/writeNews',mongoF.writeNews);
app.post('*/editUser', funct.editUser);
app.post('*/declineAlb', funct.declineAlb);
app.post("*/writeMessage", funct.writeMessage);






http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

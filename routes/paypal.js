var paypal_api = require('paypal-express-checkout')
	, mongoF = require('../routes/mongoF')
	, index = require('../routes/index')
	, crypto = require('crypto')
	, funct = require('../routes/functions');



exports.pay = function(req, res){
	crypto.randomBytes(32, function(err, enc) {
		req.session.paypal_safety = enc.toString('hex');
		asd = paypal_api.init('finance-facilitator_api1.dark-tunes.com', '1376027112', 'AFcWxV21C7fd0v3bYYYRCpSSRl31AGP0hS-5Z4feK2vhVZr9CsqUdt8C', 'http://localhost:3000/paypal/'+req.session.paypal_safety, 'http://localhost:3000/paypal/false', true);
		

			asd.pay('20130001', req.session.albPrice, 'Album', 'EUR', function(err, url) {
				if(err){console.log(err);}
				res.send(url);
				
			});
			// wieso überhaupt get - wieso nich hier abfrage??
	});
}

exports.payOutReq = function(req, res){ 
	mongoF.findSpecific(req, res, "main", 0, function(item){
		if(main[balance] < 0){
			var msg = "wants to get"+main.balance+"payed out";
			var obj = {
						type: "payout"
						, headline: "wants to get payout"
						, msg: msg
					};
			mongoF.writeRequest(req, res, obj, function(){
				//sendet nachricht an admin
				//res.send({nr: "0", msg: "Payout of "+main[balance]+" has been initiated !"});
			});
		}
		else{
			res.send({nr: "1", msg: "you need more than x Eur to get payout"});
		}
	});
}

exports.payOut = function(req, res){
		//gesendet von admin an paypal
}

exports.priceCalculator = function(req, res){
	var path = "albums."+req.session.tempAlb;
	var eanNr = 0;
	mongoF.findSpecific(req, res, path, 0, function(album){
	
		if(album.albumInfo.barcode && album.albumInfo.ean){ eanNr = 1 }
			
		var songsNr = album.songsInfo.length;
		
		var price = songsNr * 2 + 4 (-4 * eanNr );
		
		console.log(price);
		res.send({ price: price, sNr: songsNr, ean: eanNr});
		
	});
	
}


//GET!!
exports.backFromPP = function(req, res){
	var sec = req.params.sec;

	if(sec == req.session.paypal_safety){
		//funct.setPayed(req, res);
		req.session.ppreturn = "0";
		index.index(req,res);
	}
	else if(sec == "penis"){
		req.session.ppreturn = "0";
		funct.setPayed(req, res, function(req, res){
			index.index(req,res);
		});
	}
	else if(sec == "false"){
		console.log("Paypal False");
		req.session.ppreturn = "1";
		index.index(req,res);
	}
	else{
		console.log("Paypal Cheated "+sec);
		req.session.ppreturn = "2";
		index.index(req,res);
	}
}
var mongoF = require('../routes/mongoF')
	, ObjectID = require('mongodb').ObjectID
	, routes = require('../routes')
	, fs = require('fs')
	, crypto = require('crypto')
	, imag = require('imagemagick');


// Exports
//// Registration
exports.registrate = function(req, res) {
	if(req.body.R_password == req.body.R_password2){ //&& req.body.R_password.length > 5 
		exports.checkmail(req, res, req.body.R_email.toLowerCase(), function(req, res, checker){
			exports.regDB(req, res, function(req, res, profil){
				mongoF.addProfil(req, res, profil, function(req, res){
					mongoF.findByEmail(req, res, profil.email, function(req, res, item){
						req.session.email = profil.email;
						req.session.pass = profil.main.password;
						req.session.account_state = profil.main.account_state;
						req.session.language = profil.main.language;
						res.redirect("/");
					});
				});
			});
		});
	}
	else{
		res.send({nr: "1", msg: "pw problem"});
	}
}

exports.checkmail = function(req, res, email, callback){
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if(reg.test(email) == false) {
		console.log('Invalid Email Address');
		res.send({nr: "1", msg: "Not real Email"});
		//return 1;
	}
	else{
		if(email == req.session.email){
			callback(req, res);
		}
		else{
			mongoF.findByEmail(req, res, email, function(req, res, item){
				if(item){res.send({nr: "1", msg: "Email Exists"});}
				else{ callback(req, res);}
			});
		}
	}
}

//// Login

exports.login = function(req, res){
	log = req.body;
	mongoF.findSpecific(req, res, "main", 0, function(item){
		console.log("blaaa");
		if(item){
			console.log("if");
			if(log.password == item.password){
				req.session.email = log.email;
				req.session.pass = log.password;
				req.session.account_state = item.account_state;
				req.session.language = item.language;
				res.send({login: "1", nr: "0", msg: "you got logged in !"})
			}
			else{res.send({nr: "1", msg: "wrong password !"}); console.log("else");}
		}
		else{console.log("eeelse"); res.send({nr: "1", msg: "username not found !"});}
	});
}

//// Upload
exports.imageUpload = function(req, res){

	var tmp_path = req.files.Datei.path;
	var tempAlbName = 0;
	var albPath = './public/pictures/'+req.session.email;
	
	var target_path = albPath + '/cover.jpg';
	fs.mkdir(albPath, 0777, function (err) {
		
		
		//if(meta.width == meta.height && meta.witdh >= 600 && meta.format == "JPEG"){
				if(!req.session.tempAlb){
				//mongoF.findSpecific(req, res, search, where, function(item){ // gehört in load funktion von upload songs
					var timestamp = Math.floor(new Date().getTime()/1000);
					var imageName = new ObjectID(timestamp);
					imageName = imageName.toString();
					req.session.tempAlb = imageName;
				}
				var path = "albums."+req.session.tempAlb;
				var key = {};
				var key2 = {};
				key[(path+".imageName")] = req.session.tempAlb;
				key2[(path+".state")] = 1;
				fs.rename(tmp_path, target_path, function(err) {
					if (err) throw err;
					fs.unlink(tmp_path, function() {
						//imag.readMetadata(target_path, function(err, meta){
							if (err) throw err;
							mongoF.saveFileInDB(req, res, req.session.email, req.session.tempAlb, "img",  target_path, function(){
								mongoF.updateProfil(req, res, key, function(req, res){
									mongoF.updateProfil(req, res, key2, function(req, res){
										mongoF.readFileFromDB_IMG(req, res, req.session.email, req.session.tempAlb, target_path, function(){
										});
									});
								});
								
							});
						//});
					});
				});
		//}
		//else{
			//res.send({nr: "1", msg: "image not fine!"});
		//}
	});
}

//// Settings
exports.submitPass = function(req, res){
	var info = req.body;
	if(info.oldPass == req.session.pass){
		if(info.Pass == info.Pass2){
			mongoF.updateProfil(req, res, {"main.password":  info.Pass}, function(req, res){
				req.session.pass = info.Pass;
				res.send({nr: "0", msg: "password changed!"});
			});
		}
		else{ res.send({nr: "1", msg: "passwords not equal!"}); }
	}
	else{ res.send({nr: "1", msg: "password wrong!"}); }
}

exports.submitContact = function(req, res){
	var info = req.body;
	var insert = {"settings.contact": info };
	exports.checkmail(req, res, info.email, function(req, res, check){
		exports.checkEmpty(req, res, info, function(req, res){
			mongoF.updateProfil(req, res, insert, function(req, res){
				res.send({nr: "0", msg: "Contact Saved"});
			});
		});
		
	});
}

exports.submitBank = function(req, res){
	var info = req.body;
	console.log(JSON.stringify(info));
	res.send({nr: "1", msg: "not defined Yet!"});
}

exports.submitPref = function(req, res){
	var info = req.body;
	var insert = { "preferences": info };
	mongoF.updateProfil(req, res, insert, function(req, res){
		res.send({nr: "0", msg: "Preferences Saved"});
	});
}

exports.checkEmpty = function(req, res, obj, callback, reqFields){
	var j = 0;
	console.log(obj);
	
		console.log("no req field");
		for(var i in obj){
			console.log("schleife");
			if(reqFields && reqFields <= i){console.log("hiii?");break;}

			if(obj[i] == ""){
				j = i;
				break;
			}
			
		}
	if(j != 0){
		res.send({nr: "1", msg: "Please enter "+i+" !"});
	}
	else{
		callback(req, res);
	}
}



exports.uplAlbInfo = function(req, res){
	var info = req.body;
	var path = "albums."+req.session.tempAlb+".albumInfo";
	var key = {};
	key[path] = info;
	
	exports.checkEmpty(req, res, info, function(){
		mongoF.updateProfil(req, res, key, function(req, res){
			res.send({nr: "0", msg: "Album info saved"});
		});
	}, 2);


}






//// Render Stuff


exports.genVars = function(req, res, callback){	
	var nav = { email: req.session.email };
	
	if(!req.session.email){
		return callback(req, res, nav);
	}
	else{
		exports.genDash(req, res, function(req, res, dash){
			return callback(req, res, nav, dash);
		});
	}
}

exports.genSett = function(req, res, callback){
	mongoF.findSpecific(req, res, "settings", 0,  function(sett){
		console.log(sett);
		return callback(req, res, sett);
	});
}

exports.genDash = function(req, res, callback){
	mongoF.findSpecific(req, res, "main", 0, function(dash){
		return callback(req, res, dash);
	});
}

exports.createAlbum = function(req, res){
	//check albums //return var length = album.length / var tempAlb = is there state unfinished
	var tempAlb = 0;
	var albLength = 0;
	
	if(tempAlb == 0){
		var album = {
			 imageLink : ""
			, state : "1" //1,2,3,4,checking, denied, checked, Available
			, albumInfo : {
				Title : ""
				, Interpret : ""
				, ExactInterpret : ""
				, DigitalReleaseDate : ""
				, Language : ""
				, MediaType : ""
				, Genre : ""
				, IndividualGenre : ""
				, CatalogNumber : ""
				, Barcode : ""
				, CdReleaseDate : ""
				, FeaturedBy : ""
				, CopyrightRecording : ""
				, CopyrightPackaging : ""
			}
			, songs : {
				songOne : {
					songLink : ""
					, TrackTitle : ""
					, Volume : ""
					, Track : ""
					, Interpret : ""
					, Komponist : ""
					, Textauthor : ""
					, ISRC : ""
					, etc: ""
				}
			
			}
			, payment : {
			
			}
		};
		//safeAlbum(album, albumLength(//name of album//));
	}
}





// Functions
//// Registration

exports.regDB = function(req, res, callback){
	encPass = req.body.R_password;
	crypto.randomBytes(64, function(ex, buf){
		var profil = {
						email: req.body.R_email.toLowerCase()
						, main: {
							password: encPass
							, balance: "0,00"
							, account_state: "normal user"
							, language: 0
							, email_freischaltung: buf
							// freischaltlink: "" // "oihaiu"   // kann einloggen aber nichts machen
							// 
						}
						, settings: {
							contact: {
								is_company: 0
								, email: ""
								, prename: ""
								, lastname: ""
								, streetname: ""
								, streetNr: ""
								, plz: ""
								, cityname: ""
								, country: ""
								, phonePre: ""
								, phoneNr: ""
								, firmenname: ""
								, ust_id: ""
								, kleinunternehmer: 0
							}
							, bank:{
							
							}
							, pref:{
							
							}
						}
						, artists: {
						
						}
						, albums: {
							
						}
						, bank: {
							balance: 0
							, currency: 0
						}
					};
					callback(req, res, profil);
				});
	
}
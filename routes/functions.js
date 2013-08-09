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
						console.log("found email");
						req.session.email = profil.email;
						req.session.pass = profil.main.password;
						req.session.account_state = profil.main.account_state;
						req.session.language = profil.main.language;
						console.log("session");
						console.log(req.session);
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
		console.log(item);
		if(item){
			console.log("if");
			if(log.password == item.password){
				req.session.email = log.email;
				req.session.pass = log.password;
				req.session.account_state = item.account_state;
				req.session.language = item.language;
				req.session.tempAlb = item.tempAlb;
				console.log("TEMPALB");
				console.log(req.session.tempAlb);
				res.send({login: "1", nr: "0", msg: "you got logged in !"})
			}
			else{res.send({nr: "1", msg: "wrong password !"}); console.log("else");}
		}
		else{console.log("eeelse"); res.send({nr: "1", msg: "username not found !"});}
	});
}

//// Upload
exports.imageUpload = function(req, res){
	console.log("-------------------------");

	var tmp_path = req.files.Datei.path;
	var tempAlbName = 0;
	var albPath = './public/pictures/'+req.session.email;
	
	var target_path = albPath + '/cover.jpg';
	fs.mkdir(albPath, 0777, function (err) {
		
		
		console.log(req.session.tempAlb);
			//if(meta.width == meta.height && meta.witdh >= 600 && meta.format == "JPEG"){
		switch(req.session.tempAlb){
			case undefined:
				console.log("no tempAlb");
				crypto.randomBytes(64, function(ex, buf){
					rnd = buf.toString("hex");
					req.session.tempAlb = rnd;
					path = "main.tempAlb";
					var key = {};
					key[path] = rnd;
					mongoF.updateProfil(req, res, key, function(req, res){
						exports.imageUpload(req, res);
					});
				});
				break;
			default:
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
									fs.unlink(target_path, function(){	
										mongoF.readFileFromDB_IMG(req, res, req.session.email, req.session.tempAlb, function(img){
											res.send(img);
										});
									});
								});
								
							});
						//});
					});
				});
				break;
		}
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

exports.checkEmpty = function(req, res, obj, callback){
	var j = new Array();

	
		for(var i in obj){
			if(obj[i] == ""){
				j.push(i);
			}
			
		}
	if(j.length > 0){
		res.send({"nr": "1", "msg": "Please enter "+j.length+" more fields !", "obj": j});
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
	});


}


exports.uplWavInfo = function(req, res){
	var nr = req.body.hiddenNr;
	var info = req.body;
	delete info["hiddenNr"];
	var path = "albums."+req.session.tempAlb+".songsInfo.song_"+nr;
	
	var key = {};
	key[path] = info;
	
	console.log(info);
	exports.checkEmpty(req, res, info, function(){
		mongoF.updateProfil(req, res, key, function(req, res){
			res.send({nr: "0", msg: "Album info saved"});
		});
	});
}

exports.removeSong = function(req, res){
	console.log(req.body);
	var song = req.body;
	for(i in song){
		var obj = i;
		console.log(i);
		var path = "albums."+req.session.tempAlb+".songsInfo."+obj;
		var key = {};
		key[path] = 0;
		mongoF.removeElem(req, res, key, function(){
			console.log("GESCHAFFT");
		});
	}	
}

exports.addArtist = function(req, res){
	var info = req.body;
	var id = new ObjectID();
	var required = info.artistName;
	var path = "artists."+id;
	var key = {};
	key[path] = [info];
	console.log(key);
	exports.checkEmpty(req, res, required, function(){
		mongoF.updateProfil(req, res, key, function(req, res){
			res.send({nr: "0", msg: "Artist saved"});
		});
	});
}

exports.removeArtist = function(req, res){


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

exports.genUpl = function(req, res, callback){
	if(req.session.tempAlb){ //tempalb wird kreiert obwohl kein img existiert
		var path = "artists";
		var path2 = "albums";
		var alb = req.session.tempAlb;
		mongoF.findSpecific(req, res, path, 0, function(artist){
			mongoF.findSpecific(req, res, path2, 0, function(upl){
				mongoF.readFileFromDB_IMG(req, res, req.session.email, req.session.tempAlb, function(img){
					if(img){	
						uplo = JSON.stringify(upl[alb]);
						art = JSON.stringify(artist);
						return callback(upl[alb], img, art);
					}
					else{
						return callback(false, false, art);
					}
				});
			});
		});
	}
	else{
		return callback();
	}
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
							, tempAlb: ""
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
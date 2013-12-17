var mongoF = require('../routes/mongoF')
	, ObjectID = require('mongodb').ObjectID
	, routes = require('../routes')
	, fs = require('fs')
	, crypto = require('crypto')
	, imag = require('imagemagick');


// Exports
//// Registration
exports.registrate = function(req, res) {
	exports.checkEmpty(req, res, req.body, function(){
		console.log(req.body.checkAgb);
		var info = req.body;
		if(info.R_password == info.R_password2){ //&& req.body.R_password.length > 5
			if( info.checkAgb == "on" ){
				req.session.logpass = info.R_password;
				req.session.logmail = info.R_email.toLowerCase(); 
				exports.checkmail(req, res, req.session.logmail, function(req, res){
					exports.regDB(req, res, function(req, res, profil){
						mongoF.addProfil(req, res, profil, function(){
							var contact = info;
							var email = info.R_email;
							delete contact.R_password;
							delete contact.R_password2;
							delete contact.checkAgb;
							delete contact.R_email;

							var insert = {};
							var path = "settings.contact";
							insert[path] = contact;
							mongoF.updateProfil(req, res, insert, email, function(req, res){
								mongoF.setStat(req, res, "user", 1, function(){
									exports.login(req, res);
								});
							});
						});
					});
				});
			}
			else{
				res.send({nr: "1", msg: "Bitte Akzeptiere die AGB's"});
			}
		}
		else{
			res.send({nr: "1", msg: "Passwort nicht übereinstimmend"});
		}
	});
}

exports.checkmail = function(req, res, email, callback){
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if(reg.test(email) == false) {
		res.send({nr: "1", msg: "Keine richtige Email-Adresse"});
		//return 1;
	}
	else{
		if(email == req.session.email){
			callback(req, res);
		}
		else{
			mongoF.findByEmail(req, res, email, function(req, res, item){
				if(item){res.send({nr: "1", msg: "Account schon auf dieser Email-Adresse registriert"});}
				else{ callback(req, res);}
			});
		}
	}
}

//// Login

exports.login = function(req, res){
	if(!req.session.logpass){
		var log = req.body;
		req.session.logmail = req.body.email;
	}
	else{
		var log = {};
		log.password = req.session.logpass; 
	}
	mongoF.findSpecific(req, res, "main", 0, function(item){
		console.log(log.password);
		console.log(item.password);
		if(item){
			console.log("if");
			if(log.password == item.password){
				console.log("hallo ich bin die id: "+req.session._id);
				req.session.email = req.session.logmail;
				req.session.pass = log.password;
				req.session.account_state = item.account_state;
				req.session.language = item.language;
				req.session.tempAlb = item.tempAlb;
				res.send({login: "1", nr: "0", msg: "Du bist Eingeloggt!"})
			}
			else{res.send({nr: "1", msg: "Falsches Passwort !"});}
		}
		else{res.send({nr: "1", msg: "Nutzername nicht gefunden !"});}
	});
}

//// Upload

exports.uploadWav = function(req, res){
	exports.getState(req, res, function(){
		var tmp_path = req.files.song.path;
		var Nr = req.body.Nr;
		var tempAlbName = 0;
		var albPath = './uploads/'+req.session.email+'/'+req.session.tempAlb;
		
		var id = new ObjectID();
		var target_path = albPath + '/'+id+'.wav';
		var key = {};
		var path = "albums."+req.session.tempAlb+".songsInfo.song_"+Nr+".songId";
		key[path] = id;
		
		//if path has an id => del that id out of db
		fs.rename(tmp_path, target_path, function(err) {
			fs.unlink(tmp_path, function() {
				mongoF.updateProfil(req, res, key, 0, function(req, res){
					res.send(id);
				});
			});
		});
	});
}

exports.four = function(req,res){
	res.send({error: 404});
}

exports.imageUpload = function(req, res){
		exports.getState(req, res, function(){
			var tmp_path = req.files.Datei.path;
			var tempAlbName = 0;
			switch(req.session.tempAlb){
				case "":
					console.log("no tempAlb");
					crypto.randomBytes(16, function(ex, buf){
						rnd = buf.toString("hex");
						req.session.tempAlb = rnd;
						path = "main.tempAlb";
						var key = {};
						key[path] = rnd;
						console.log("rnd: "+rnd);
						var albPat = './uploads/'+req.session.email;
						var albPath = albPat+'/'+req.session.tempAlb.toString(16);
						fs.mkdir(albPat, 0777, function (err) {
							fs.mkdir(albPath, 0777, function (err) {
								mongoF.updateProfil(req, res, key, 0, function(req, res){
									var path2 = path+"."+rnd+".timestamp";
									var key2 = {};
									key2[path2] = new Date();
									mongoF.updateProfil(req, res, key2, 0, function(req, res){
										exports.imageUpload(req, res);
									});
								});
							});
						});
					});
					break;
				default:
					var target_path = './uploads/'+req.session.email+'/'+req.session.tempAlb+'/cover.jpg';
					console.log("HAS TEMPALB");
					var path = "albums."+req.session.tempAlb;
					var key = {};
					key[(path+".imageName")] = req.session.tempAlb;
					fs.rename(tmp_path, target_path, function(err) {
						if (err) throw err;
						fs.unlink(tmp_path, function() {
							if (err) throw err;
							mongoF.getFileUser(req, res, 0, 0, 0, function(img){
								mongoF.updateProfil(req, res, key, 0, function(req, res){
									exports.setState(req, res, "1", 0, 0, function(){
										res.send(img);
									});
								});
							});
						});
					});
					break;
			}
		});
}

//// Settings
exports.submitPass = function(req, res){ // hier vorher noch abruf
	var info = req.body;
	if(info.oldPass == req.session.pass){
		if(info.Pass == info.Pass2){
			mongoF.updateProfil(req, res, {"main.password":  info.Pass}, 0, function(req, res){
				req.session.pass = info.Pass;
				res.send({nr: "0", msg: "Passwort geändert!"});
			});
		}
		else{ res.send({nr: "1", msg: "Passwörter sind nicht gleich!"}); }
	}
	else{ res.send({nr: "1", msg: "Passwort Falsch!"}); }
}

exports.submitContact = function(req, res){
	var info = req.body;
	var insert = {"settings.contact": info };
	exports.checkmail(req, res, info.email, function(req, res, check){
		exports.checkEmpty(req, res, info, function(req, res){
			mongoF.updateProfil(req, res, insert, 0, function(req, res){
				res.send({nr: "0", msg: "Kontaktinformationen Gespeichert"});
			});
		});
		
	});
}

exports.submitBank = function(req, res){ /// MACHEN !!!
	var info = req.body;
	console.log(JSON.stringify(info));
	res.send({nr: "1", msg: "bisher nicht angegeben!"});
}

exports.submitPref = function(req, res){
	var info = req.body;
	var insert = { "preferences": info };
	mongoF.updateProfil(req, res, insert, 0, function(req, res){
		res.send({nr: "0", msg: "Einstellungen gespeichert"});
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
		res.send({"nr": "1", "msg": "Bitte gebe noch "+j.length+" Felder ein !", "obj": j});
	}
	else{
		callback(req, res);
	}
}



exports.uplAlbInfo = function(req, res){
	exports.getState(req, res, function(){
		var info = req.body;

		var reldate = info.digital_ReleaseDate;
		reldate = new Date(reldate);
		var t = new Date();
		var diff = reldate - t;

		console.log("!!!!!!!!!!!!!!!!!!!!!!!!!");
		console.log(diff);
		var path = "albums."+req.session.tempAlb+".albumInfo";
		var key = {};
		key[path] = info;
		exports.checkEmpty(req, res, info, function(){
			if(info.Interpret != 0){
				if(info.subgenre != 0){
					if( diff >= 2592000000){
						exports.setState(req, res, "2", 0, 0, function(){
							mongoF.updateProfil(req, res, key, 0, function(req, res){
								res.send({nr: "0", msg: "Album information Gespeichert"});
							});
						});
					}
					else{
						res.send({nr: "1", msg: "Bitte gebe ein release datum über einem monat in der Zukunft an"});
					}
				}
				else{
					j = new Array();
					j[0] = "subgenre";
					j[1] = "genre";
					res.send({nr: "1", msg: "Bitte Genre Auswählen", obj: j});
				}
			}
			else{
				j = new Array();
				j[0] = "Interpret";
				res.send({nr: "1", msg: "Bitte Künstler Auswählen", obj: j}); // hier richtig für interpret finden
			}
		});
	});
}







exports.uplWavInfo = function(req, res){
	exports.getState(req, res, function(){
		var nr = req.body.hiddenNr;
		var info = req.body;
		info.songId = info.songId.replace(/["]/g,'');
		console.log(info);
		delete info["hiddenNr"];
		var path = "albums."+req.session.tempAlb+".songsInfo.song_"+nr;
		
		var key = {};
		key[path] = info;
		
		console.log(info);
		if(info.Künstler != 0){
			if(info.songId != 0){
				exports.checkEmpty(req, res, info, function(){
					exports.setState(req, res, "3", 0, 0, function(){
						mongoF.updateProfil(req, res, key,0, function(req, res){
							req.session.songCount++;
							res.send({nr: "0", msg: "Song information gespeichert"});
						});
					});
				});
			}
			else{
				res.send({nr: "1", msg: "Bitte song Hochladen"});
			}
		}
		else{
			res.send({nr: "1", msg: "Bitte Künstler auswählen"});
		}
	});
}

exports.removeSong = function(req, res){
	exports.getState(req, res, function(){
		console.log(req.body);
		var s = req.body;
		if(s.sId != 0){
			console.log("not null");
			var filePath = "./uploads/"+req.session.email+'/'+req.session.tempAlb+'/'+s.sId+'.wav';
			filePath = filePath.replace(/"/g, "");
			console.log("====== : "+ filePath);
			fs.unlink(filePath, function() {
				console.log("removed");
				exports.removeSongHelper(req, res, s.sId, function(){
					res.send({nr: "0", msg: "Song gelöscht"});
				});
			});
		}
		else{
			res.send({nr: "0", msg: "Song gelöscht"});
		}	
	});
}

exports.removeSongHelper = function(req, res, sId, callback){
	sId = sId.replace(/"/g, "");
	mongoF.findByEmail(req, res, req.session.email, function(req, res, item){
		var path = "albums."+req.session.tempAlb+".songsInfo";
		var elem = {};
		elem = item.albums[req.session.tempAlb].songsInfo
		var insert = {};
		
		for(key in elem){
			if(elem[key].songId == sId){
				console.log("helper found");
				insert[path+"."+key] = elem[key];
				console.log("INSERT: ");
				console.log(insert);
				mongoF.unsetProfil(req, res, insert, 0, function(){
					console.log("found");
					callback();
				});
			}
		}

		
	});
}

exports.addArtist = function(req, res){
	var info = req.body;
	var id = new ObjectID();
	var required = info.artistName;
	var path = "artists."+id;
	var key = {};
	key[path] = info;
	console.log("starting");
	exports.checkEmpty(req, res, required, function(){
		console.log("not empty");
		mongoF.addArtStat(req, res, info.artistName, function(){
			console.log("global adding passed");
			mongoF.updateProfil(req, res, key, 0, function(req, res){
				res.send({nr: "0", msg: "Künstler Gespeichert", artist: info.artistName});
			});
		});
	});
}

exports.editArtist = function(req, res){
	var inf = req.body;
	var path = "artists."+inf.hid;
	var key = {};
	delete inf.hid;
	key[path] = inf;
	mongoF.updateProfil(req, res, key, 0, function(req, res){
		res.send({nr: "0", msg: "Künstler Gespeichert", artist: inf.artistName});
	});
}

exports.removeArtist = function(req, res){


}

exports.uploadPaymentInfo = function(req, res){
	var info = req.body;
	console.log(info);
	var state = "3";
	if(state == "3"){
		switch(info.paymentMethod){
			case "paypal":
				res.send({nr: "1", msg: "Bitte zahle über Paypal oder suche dir eine andere Bezahlmethode aus"});
				break;
			case "bank":
				res.send({nr: "1", msg: "Bitte überweise den Betrag auf das genannte Konto"});
				break;
			case "voucher":
				res.send({nr: "1", msg: "Bitte validiere deinen Gutscheincode"});
				break;
		}
	}
	else if(state == "payed"){
		res.send({nr: "0", msg: "Deine Daten werden nun Überprüft"});
	}
	else{
		res.send({nr: "0", msg: "Du hast schon bezahlt"});
	}
}

exports.setState = function(req, res, state, alb, mail, callback){
	if(alb == 0){
		alb = req.session.tempAlb
	}
	var path = "albums."+alb+".state";
	var key = {};
	key[path] = state;
	mongoF.updateProfil(req, res, key, mail, function(req, res){
		callback(req, res)
	});
}

exports.getState = function(req, res, callback){
	var path = "albums";
	mongoF.findSpecific(req, res, path, 0, function(alb){
		if(!alb){
			callback();
		}
		else{
			if(alb[req.session.tempAlb]){
				if(alb[req.session.tempAlb].state != "available"){
					var state = alb[req.session.tempAlb].state;
					if(state != "payed"){
						console.log("**** is NOT payed ****");
						callback();
					}
					else{
						console.log("**** is payed ****");
						res.send({nr: "0", msg: "Kann nicht nach Zahlung gespeichert werden"});
					}
				}

			}
			else{
				callback();
			}
			
		}
	});
}

exports.calcPrice = function(req, res){
	console.log("calculating price");

	var alb = "Bundle AC Double";
	
	var path = "albums";
	mongoF.findSpecific(req, res, path, 0, function(db){
		if(db){console.log("FOUND DB!");}
		var db1 = db[req.session.tempAlb];
		var ean = 1;
		if(db1.albumInfo["barcode"]){ ean = 0; }
		console.log("EAN: "+ean);
		var sInfo = db1.songsInfo;
		var count = 0;
		for(key in sInfo){
			count++;
		}
		console.log("COUNT: "+count);
		if(count <= 26){
			alb = "Bundle AB Mid";
			if(count <= 7){
				alb = "Bundle AS EP";
				if(count <= 4){
					alb = "MB Maxi(Mid)";
				}
			}
		}
		mongoF.getSetting(req, res, "pricing", function(db2){
			req.session.albPrice = count * db2.SONG + ean * db2.EAN;
			var price = {
				"songs": count
				,"ean": ean
				,"pSong": db2.SONG
				,"pISRC": db2.ISRC
				,"pEAN":  db2.EAN
				,"name": alb
				,"total": req.session.albPrice
			};
			res.send(price);
		});
	});
}

//// Render Stuff


exports.genVars = function(req, res, callback){	
	var nav = { email: req.session.email };
	
	if(!req.session.email){
		return callback(req, res, nav);
	}
	else{
		exports.genDash(req, res, function(req, res, dash, albs, news, msg){
			return callback(req, res, nav, dash, albs, news, msg);
		});
	}
}

exports.genSett = function(req, res, callback){
	mongoF.findSpecific(req, res, "settings", 0,  function(sett){
		mongoF.findSpecific(req, res, "artists", 0, function(artist){
			console.log(sett);
			return callback(sett, artist);
		});
	});
}

exports.genDash = function(req, res, callback){
	mongoF.findSpecific(req, res, "main", 0, function(dash){
		mongoF.findSpecific(req, res, "albums", 0, function(albs){
			exports.genMsg(req, res, function(msg){
				console.log("================================");
				console.log(albs);
				var check = JSON.stringify(albs);
				if(check == "{}" || check == undefined || !albs){
					albs = 0;
					console.log("yes");
				}
				mongoF.readNews(req, res, 0, function(news){
					return callback(req, res, dash, albs, news, msg);
				});
			});
		});
	});
}

exports.genUpl = function(req, res, callback){
	req.session.songCount = 0;
	if(req.session.tempAlb){
		var path = "artists";
		var path2 = "albums";
		var alb = req.session.tempAlb;
		mongoF.findSpecific(req, res, path, 0, function(artist){
			mongoF.findSpecific(req, res, path2, 0, function(upl){
				mongoF.getFileUser(req, res, 0, 0, 0, function(img){
					if(img){
						var uplo = upl[alb];
						if(uplo.albumInfo){
							if(uplo.albumInfo.promotext){
								exports.replaceLB(req, res, uplo.albumInfo.promotext, function(back){
									uplo.albumInfo.promotext = back;
									var art = JSON.stringify(artist);
									return callback(uplo, img, art);
								});
							}
							else{
								var art = JSON.stringify(artist);
								return callback(uplo, img, art);
							}
							
						}
						else{
							var art = JSON.stringify(artist);
							return callback(uplo, img, art);
						}
						

							
					}
					else{
						return callback(false, false, art);
					}
				});
			});
		});
	}
	else{
		console.log("else");
		callback();
	}
	/*else{
		var id = new ObjectID();
		req.session.tempAlb = id;
		var path = "main.tempAlb";
		var insert = {};
		insert[path] = id;
		mongoF.updateProfil(req, res, insert, 0, function(req, res){
			return callback();
		});
	}*/
}

exports.genMsg = function(req, res, callback){
	mongoF.findSpecific(req, res, "messages", 0 , function(msgs){
		console.log("*W*W*W*W**W*W**W*W*W");
		if(!msgs){
			console.log("Path 1");
			callback(0);
		}
		else{
			msgs["amount"] = 0;
			var len = Object.keys(msgs.recieved).length;
			if(len > 0){
				var counter = 0;
				for(key in msgs.recieved){
					counter++;
					if(msgs.recieved[key].read == 0){
						msgs["amount"]++;
					}
					if(counter == len){
						callback(msgs);
					}
				}
			}
			else{
				msgs["amount"] = 0;
				callback(msgs);
			}
			
		}
	});
}

exports.genDisco = function(req, res, callback){
	mongoF.findSpecific(req, res, "albums", 0, function(upl){
		if(!upl){
			var len = 0;
		}
		else{
			var len = Object.keys(upl).length; ////// SO FINDET MAN DIE LÄNGE VON JSON RAUS!!!!!!!!!! *!*!*!*!*!*!*!*!**!*!*!*!*!**!*!*!*!**!*!*
		}
		var count = 0;
		var album = {};
		var hasAlbum = 0;
		var abgesendet = 0;
		for(key in upl){
			count++;
			if(!upl[key].albumInfo){
				console.log("keins");
			}
			else if(upl[key].albumInfo.title){
				console.log("eins");
				hasAlbum = 1;
				var imgName = upl[key].imageName;
				var albName = upl[key].albumInfo.title;
				mongoF.getFileUser(req, res, 0, key, 0, function(img){
					album[count] = {img: img, name: albName};
					if(count == len){
						abgesendet = 1;
						callback(album);
					}
				});
			}
			else{
				console.log("ASDASD");
				if(abgesendet == 0){
					if(hasAlbum == 0){
						album = 0;
					}
					if(count == len){
						callback(album);
					}
				}
			}
		}
		if(hasAlbum == 0){
			callback(0);
		}
	});
}
exports.genASett = function(req, res, callback){
	mongoF.readVoucher(req, res, function(voucher){
		callback(voucher);
	});
}


///////////
// Admin //
///////////

exports.getJSON = function(req, res, callback){
	if(req.session.account_state == "admin"){
		var id = req.params.asd;
		var mail = req.params.user;
		var elem = "albums";
		var elem2 = "artists";
		console.log("hi das ist user: "+mail);
		console.log("hi das ist asd: "+id);
		mongoF.findUnSpecific(req, res, mail, elem, id, function(item){
			mongoF.findUnSpecific(req, res, mail, elem2, 1, function(artist){
				mongoF.readFileFromDB_IMG(req, res, 0, id, function(img){
					console.log("____________________________");
					console.log(artist);
					console.log("____________________________");
					res.render('slides/slideUpl', { "upl": JSON.stringify(item[id]), "img": img, "artist": JSON.stringify(artist) });
				});	
			});
		});
	}
	else{
		res.send({nr: "1", msg: "Don't Hack"});
	}
}

exports.editUser = function(req, res){
	if(req.session.account_state == "admin"){
		var vars = req.body;
		console.log(vars);
		console.log(vars.email_sav);

		mongoF.findByEmail(req, res, vars.email_sav, function(req, res, item){

			var insA = {};
			insA["email"] = vars.email;
			var insB = {};
			insB["main"] = item.main;
			insB.main["account_state"] = vars.account_state;

			mongoF.updateProfil(req, res, insA, vars.email_sav, function(req, res){
				mongoF.updateProfil(req, res, insB, vars.email_sav, function(req, res){
					res.send({nr: "0", msg:"Profil Aktualisiert"});
				});
			});
		});
	}
	else{
		res.send({nr: "1", msg: "Don't Hack"});
	}
}

exports.declineAlb = function(req, res){ /// MUSS ZU POST BEFEHL UM NACHRICHT ZU HINTERLASSEN /////////////
	if(req.session.account_state == "admin"){
		var id = req.body.email_sav;
		var mail = req.body.albumId;
		var msg = req.body.msg
		var title = "Album Declined";
		
		exports.setState(req, res, "declined", mail, id, function(req, res){
			mongoF.writeMsg(req, res, id, msg, title, function(){
				mongoF.deleteReq(req, res, mail, function(){
					res.send({nr: "0", msg:"Album Abgelehnt"});
				});
			});
		});
	}
	else{
		res.send({nr: "1", msg: "Don't Hack"});
	}
}

exports.approveAlb = function(req, res){
	if(req.session.account_state == "admin"){
		var id = req.params.asd;
		var mail = req.params.user;
		var title = "Album Akzeptiert"
		var msg = "dein Album wurde Akzeptiert und wird in nächster Zeit bei unseren Partnern online sein."
		exports.setState(req, res, "approved", id, mail, function(req, res){
			mongoF.writeMsg(req, res, mail, msg, title, function(){
				mongoF.deleteReq(req, res, id, function(){
					res.send({nr: "0", msg:"Album Approved"});
				});
			});
		});
	}
}

exports.writeMessage = function(req, res){
	if(req.session.account_state == "admin"){
		var email = req.body.email;
		var msg = req.body.msg;
		mongoF.writeMsg(req, res, email, msg, "admin sent you a Message", function(){
			res.send({nr: "0", msg:"Message Sent"})
		});

	}
}

/////////////
// Payment //
/////////////

exports.setPayed = function(req, res, callback){
	exports.setState(req, res, "payed", 0, 0, function(req, res){
		//send mess to user => alb xy is now payed
		mongoF.albumNotification(req, res, "1", function(req, res){
			callback(req, res);
		});
	});
}




/////////////
// Fill DB //
/////////////

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
	var encPass = req.body.R_password;
	var msgId = new ObjectID();
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
							, bank:{}
							, pref:{}
						}
						, artists: {}
						, messages: {
							sent: {}
							, recieved: {}
						}
					};
		profil.messages.recieved[msgId] = {
			title: "Welcome"
			, from: "Darktunes"
			, msg: "Welcome to Darktunes"
			, time: "time"
			, read: 0
		};
		callback(req, res, profil);
	});
	
}

exports.replaceLB = function(req, res, str, callback){
	if(str){
		console.log("|||||||||||||||| 1");
		var str2 = str.replace(/(\r\n|\n|\r)/gm,"wwwwwwwwwwwwwwwwww");

		console.log(str2);
		callback(str2);	
	}
	else{
		console.log("|||||||||||||||| 2");
		callback("");
	}

}
var mongoF = require('../routes/mongoF')
	, routes = require('../routes');
var fs = require('fs');

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
						req.session.admin = profil.main.admin;
						req.session.account_state = profil.main.account_state;
						req.session.language = profil.main.language;
						exports.createFolders(req,res);
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
	mongoF.findSpecific(req, res, "main", function(req, res, item){
		if(item){
			if(log.password == item.password){
				req.session.email = log.email;
				req.session.pass = log.password;
				req.session.admin = item.admin;
				req.session.account_state = item.account_state;
				req.session.language = item.language;
				res.redirect("/");
			}
			else{console.log("wrong pw");}
		}
		else{console.log("username not found");}
	});
}

//// Upload
exports.imageUpload = function(req, res){

	var tmp_path = req.files.Datei.path;
	var tempAlbName = 0;
	var albPath = './public/pictures/'+req.session.email + '/alben/'
	
	if(!req.session.tempAlb){
		tempAlbName = "tem_" + Math.floor((Math.random()*1000)+1);
		fs.mkdir(albPath + tempAlbName, 0777, function (err) {
			//trage tempalbname in db ein
			req.session.tempAlb = tempAlbName;
		});
	}
	else{
		tempAlbName = req.session.tempAlb;
	}
	
	var target_path = albPath + tempAlbName + '/cover.jpg';
	fs.rename(tmp_path, target_path, function(err) {
		if (err) throw err;
		fs.unlink(tmp_path, function() {
			if (err) throw err;
			mongoF.saveFileInDB(req, res, req.session.email, req.session.tempAlb, "img",  target_path, function(){
				res.send('pictures/'+req.session.email + '/alben/' + tempAlbName + '/cover.jpg');
			});
			//res.send('pictures/'+req.session.email + '/alben/' + tempAlbName + '/cover.jpg');
		});
		
	});
	
}

//// Settings
exports.submitPass = function(req, res){
	var info = req.body;
	if(info.oldPass == req.session.pass){
		if(info.Pass == info.Pass2){
			mongoF.updateProfil(req, res, {"password":  info.Pass}, function(req, res){
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
	var insert = {"settings": { "contact": info }};
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
	var j = 0;
	for(var i in obj){
		if(obj[i] == ""){
			var j = i;
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



//// Render Stuff


exports.genVars = function(req, res, callback){
	var nav = { email: req.session.email
			, name: req.session.name
			, error : req.session.error};
	return callback(req, res, nav);
}

exports.genSett = function(req, res, callback){
	mongoF.findSpecific(req, res, "settings", function(req, res, sett){
		console.log(sett);
		callback(req, res, sett);
	});
}


exports.createFolders = function(req, res){
	var dir_path = './public/pictures/'+req.session.email;
	var path2 = dir_path + "/alben";
	var path3 = dir_path + "/profil";
	var path4 = dir_path + "/statistic";
	
	fs.mkdir(dir_path, 0777, function (err) {
		if (err) {
			console.log(err);
		} else {
			fs.mkdir(path2, 0777, function (err) {});
			fs.mkdir(path3, 0777, function (err) {});
			fs.mkdir(path4, 0777, function (err) {});
		}
	});
}





// Functions
//// Registration

exports.regDB = function(req, res, callback){
	encPass = req.body.R_password;
	var profil = {
					email: req.body.R_email.toLowerCase()
					, main: {
						password: encPass
						, admin: 0
						, account_state: 0
						, language: 0
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
}
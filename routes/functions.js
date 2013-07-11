var mongoF = require('../routes/mongoF')
	, routes = require('../routes');
var fs = require('fs');

// Exports
//// Registration
exports.registrate = function(req, res) {
	if(req.body.R_password == req.body.R_password2 && req.body.R_email != "" && req.body.R_password != ""){
		console.log("first passed");
		var profil = {email: req.body.R_email.toLowerCase()
					, password: req.body.R_password};
		exports.checkmail(req, res, profil.email, function(req, res, checker){
		console.log("HIER: "+checker);
			if(checker == 0){
				
				console.log("regComplete: "+req.body.R_email);
				mongoF.addProfil(req, res, profil, function(req, res){
					mongoF.findByEmail(req, res, profil.email, function(req, res, item){
						req.session.email = profil.email;
						req.session.pass = profil.password;
						req.session.id = item._id;
						exports.createFolders(req,res);
						res.redirect("/");
					});
				});
			}
			else if(checker == 1){
				console.log("not real Email");
			}
			else if(checker == 2){
				console.log("email in use");
			}
			else{
				console.log("wtf happened");
			}
		});
	}
	else{
		console.log("regFail")
		routes.index(req,res); //** fehler nr einbauen **
	}
};

exports.checkmail = function(req, res, email, callback){
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if(reg.test(email) == false) {
		console.log('Invalid Email Address');
		callback(req, res, 1);
		//return 1;
	}
	else{
		mongoF.findByEmail(req, res, email, function(req, res, item){
			if(item){
				callback(req, res, 2);
				//return 2;
			}
			else{
				callback(req, res, 0);
				//return 0;
			}
		});
	}
}

//// Login

exports.login = function(req, res){
	log = req.body;
	mongoF.findByEmail(req, res, log.email, function(req, res, item){
		if(item){
			if(log.password == item.password){
				req.session.email = log.email;
				req.session.pass = log.password;
				req.session.id = item._id;
				res.redirect("/");
			}
			else{
				console.log("wrong pw");
			}
		}
		else{
			console.log("username not found");
		}
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
exports.submitSett = function(req, res){
	info = req.body;
	console.log(info);
	if(info.oldPass == req.session.pass){
		if(info.Pass == info.Pass2){
			mongoF.updateProfil(req, res, {"password":  info.Pass}, function(req, res){
				console.log("penis");
				req.session.pass = info.Pass;
				res.send({nr: "0", msg: "pass changed!"});
			});
		}
		else{
			res.send({nr: "1", msg: "passwords not equal!"});
		}
	}
	else{
		res.send({nr: "1", msg: "password wrong!"});
	}
}



//// Render Stuff

exports.genVars = function(req, res, callback){
	var nav = { email: req.session.email
			, name: req.session.name
			, error : req.session.error};
	return callback(req, res, nav);
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

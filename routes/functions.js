var mongoF = require('../routes/mongoF')
	, routes = require('../routes');

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
					req.session.email = profil.email;
					req.session.pass = profil.password;
					res.redirect("/");
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


//// Render Stuff

exports.genVars = function(req, res, callback){
	var nav = { email: req.session.email
			, name: req.session.name
			, error : req.session.error};
	return callback(req, res, nav);
}

exports.genUserList = function(req, res, callback){
	
}








// Functions
//// Registration

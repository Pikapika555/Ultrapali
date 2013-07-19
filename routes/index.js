var funct = require('../routes/functions')
	, mongoF = require('../routes/mongoF');
// GET
//// Views

exports.state = function(req, res, adminPage, callback){ //Write in every get szenario // move to functions
	var state = req.session.account_state;
	if(!state){
		res.send("you're logged out - please login to continue");
	}
	else{
		if(!adminPage){
			callback();
		}
		else if(adminPage && req.session.userstate == "admin"){
			callback();
		}
		else{
			//write db hacktrys +1 //+timestamp?
			res.send("you're not authorized to view this page, your ip got recorded");
		}
	}
}

exports.index = function(req, res){
	funct.genVars(req, res, function(req, res, nav, dash){ //hier keine abfrage
		if(!req.session.email){
			res.render('index', { title: 'Express', navi: nav });
		}
		else if(req.session.email){
			/////////////////////generateData(){req, res, function(data){ res.render(bla, {data})}}
			res.render('sideNav', { title: 'Express', navi: nav, dash: dash });
		}
	});
}

exports.dashboard = function(req, res){ //hier keine abfrage - nur req session
	exports.state(req, res, false, function(){
		funct.genDash(req, res, function(req, res, dash){
			res.render('slides/slideDash', { dash: dash });
		});
	});
}
/*
exports.message = function(req, res){
	res.render('slides/slideMess', {});
}
*/
exports.upload = function(req, res){
	exports.state(req, res, false, function(){
		res.render('slides/slideUpl', {});
	});
}

exports.settings = function(req, res){
	exports.state(req, res, false, function(){
		funct.genSett(req,res, function(req, res, sett){
			res.render('slides/slideSett', { sett: sett });
		});
	});
}

exports.statistic = function(req, res){
	exports.state(req, res, false, function(){
		res.render('slides/slideStat', {});
	});
}

exports.profil = function(req, res){
	exports.state(req, res, false, function(){
		res.render('slides/slideProf', {});
	});
}
/*
exports.premium = function(req, res){
	res.render('slides/slidePrem', {});
}
*/
exports.adminUser = function(req, res){
	exports.state(req, res, true, function(){
		mongoF.findAll(req, res, function(req, res, items){
			res.render('slides/slideAUser', { users: items });
		});
	});
}

exports.adminReq = function(req, res){
	exports.state(req, res, true, function(){
		res.render('slides/slideAReq', {});
	});
}

exports.adminSett = function(req, res){
	exports.state(req, res, true, function(){
		res.render('slides/slideASett', {});
	});
}

exports.adminLang = function(req, res){
	exports.state(req, res, true, function(){
		res.render('slides/slideALang', {});
	});
}


//// Extra
exports.logout = function(req, res){
	 req.session.destroy(function() {
		res.redirect('/');
	 });
}



// POST ///// Later on sepperate in different docs

exports.logHack = function(req,res){
	req.session.username = "Pika"
	res.redirect('/');
}


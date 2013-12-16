var funct = require('../routes/functions')
	, mongoF = require('../routes/mongoF');
// GET
//// Views

exports.state = function(req, res, adminPage, callback){ //Write in every get szenario // move to functions
	var state = req.session.account_state;
	if(!state){
		console.log("not logged in");
		res.send("you're logged out - please login to continue");
	}
	else{
		if(state == "banned"){
			res.send("you got banned");
		}
		if(!adminPage && req.session.account_state != "banned"){
			callback();
		}
		else if(adminPage && req.session.account_state == "admin"){
			callback();
		}
		else{
			//write db hacktrys +1 //+timestamp?
			res.send("you're not authorized to view this page, your ip got recorded");
		}
	}
}

exports.index = function(req, res){
	var vars = {};
	if(req.session.ppreturn){
		vars["paypal"] = req.session.ppreturn;
		delete req.session.ppreturn;
	}
	funct.genVars(req, res, function(req, res, nav, dash, albs, news, msg){ //hier keine abfrage
		vars["title"] = "Express";
		vars["navi"] = nav;

		if(req.session.email){
			vars["dash"] = dash;
			vars["albs"] = albs;
			vars["news"] = news;
			vars["msg"] = msg;
		}
		res.render('layout', vars);
	});
}

exports.dashboard = function(req, res){ //hier keine abfrage - nur req session
	exports.state(req, res, false, function(){
		funct.genDash(req, res, function(req, res, dash, albs, news){
			res.render('slides/slideDash', { dash: dash, albs: albs, news: news });
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
		funct.genUpl(req, res, function(upl, img, artist){
			res.render('slides/slideUpl', { "upl": JSON.stringify(upl), "img": img, "artist": artist });
		});
	});
}

exports.albums = function(req,res){
	exports.state(req, res, false, function(){
		funct.genDisco(req, res, function(alb){
			res.render('slides/slideAlb', {album: alb});
		});
	});
}

exports.statistic = function(req, res){
	exports.state(req, res, false, function(){
		funct.genDisco(req, res, function(alb){	
			res.render('slides/slideStat', {album: alb});
		});
	});
}

exports.settings = function(req, res){
	exports.state(req, res, false, function(){
		funct.genSett(req,res, function(sett, art){
			res.render('slides/slideSett', { sett: sett, art: art });
		});
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
		mongoF.readRequest(req, res, true, function(requests){
			res.render('slides/slideAReq', {req : requests});
		});
	});
}

exports.adminSett = function(req, res){
	exports.state(req, res, true, function(){
		funct.genASett(req,res,function(voucher){
			res.render('slides/slideASett', {voucher: voucher});
		})
	});
}

exports.adminLang = function(req, res){
	exports.state(req, res, true, function(){
		res.render('slides/slideALang', {});
	});
}

exports.adminNews = function(req, res){
	exports.state(req, res, true, function(){
		mongoF.readNews(req, res, 0, function(news){
			res.render('slides/slideANews', {news: news});
		});
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


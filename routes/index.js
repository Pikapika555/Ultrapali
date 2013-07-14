var funct = require('../routes/functions')
	, mongoF = require('../routes/mongoF');
// GET
//// Views
exports.index = function(req, res){
	funct.genVars(req, res, function(req, res, nav){
		if(!req.session.email){
			res.render('index', { title: 'Express', navi: nav });
		}
		else if(req.session.email){
			/////////////////////generateData(){req, res, function(data){ res.render(bla, {data})}}
			res.render('sideNav', { title: 'Express', navi: nav });
		}
	});
}

exports.dashboard = function(req, res){
	res.render('slides/slideDash', {layout: false, title: 'Express', username: req.session.username });
}

exports.message = function(req, res){
	res.render('slides/slideMess', {layout: false, title: 'Express', username: req.session.username });
}

exports.upload = function(req, res){
	res.render('slides/slideUpl', { layout: false, title: 'Express', username: req.session.username });
}

exports.settings = function(req, res){
	funct.genSett(req,res, function(req, res, sett){
		res.render('slides/slideSett', { layout: false, title: 'Express', sett: sett });
	});
}

exports.statistic = function(req, res){
	res.render('slides/slideStat', { layout: false, title: 'Express', username: req.session.username });
}

exports.profil = function(req, res){
	res.render('slides/slideProf', { layout: false, title: 'Express', username: req.session.username });
}

exports.premium = function(req, res){
	res.render('slides/slidePrem', { layout: false, title: 'Express', username: req.session.username });
}

exports.adminUser = function(req, res){
	mongoF.findAll(req, res, function(req, res, items){
		res.render('slides/slideAUser', { title: 'Express', users: items });
	});
}

exports.adminReq = function(req, res){
	res.render('slides/slideAReq', { title: 'Express' });
}

exports.adminSett = function(req, res){
	res.render('slides/slideASett', { title: 'Express' });
}

exports.adminLang = function(req, res){
	res.render('slides/slideALang', { title: 'Express' });
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


var mongo = require('mongodb');

var fs = require('fs');
var Server = mongo.Server,
	Db = mongo.Db,
	BSON = require('mongodb').pure().BSON,
	ObjectID = require('mongodb').ObjectID,	
	MongoClient = require('mongodb').MongoClient,
    ReplSetServers = require('mongodb').ReplSetServers,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    crypto = require('crypto'),
    funct = require('../routes/functions'),
    assert = require('assert');
	
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('dT_Netlabel', server);

var grid = require('mongodb').GridStore;

//TODO: PW EINGABE SUCHEN

db.open(function(err,db){
	if(!err) {
		console.log("Connected to database");
		db.collection('profiles', {strict:true}, function(err, collection) {
			if (err) {
				console.log("The collection doesn't exist. Creating it with sample data...");
				populateDB();
			}
		});
	}
});




exports.findByEmail = function(req, res, mail, callback) {
	mail = mail.toLowerCase();
	db.collection('profiles', function(err, collection) {
		collection.findOne({'email': mail}, function(err, item) {
			callback(req, res, item); //req, res, item!?
		});
	});
};


exports.findSpecific = function(req, res, elem, where, callback) {
	if(!req.session.email){
		var mail = req.session.logmail;
	}
	else{
		var mail = req.session.email;
	}
	var search = {};
	if(where == 0){
		search[elem] = 1;
	}
	else{
		search[elem] = where;
	}
	db.collection('profiles', function(err, collection) {
		collection.findOne({'email': mail}, search, function(err, item) {
			if(item){
				bla = elem.toString();
				callback(item[elem]);
			}
			else{
				callback(false);
			}
		});
	});
};

exports.findUnSpecific = function(req, res, mail, elem, where, callback){
	db.collection('profiles', function(err, collection) {
		var search = {};
		search[elem] = where;
		collection.findOne({"email": mail}, search, function(err, item) {
			if(item){
				callback(item[elem]);
			}
			else{
				res.send("error");
			}
		});
	});
}

exports.removeElem = function(req, res, elem, callback){
	var mail = req.session.email;
	//var search = {};
	//search[path] = elem;
	db.collection('profiles', function(err, collection) {
		collection.update({'email': mail}, { $unset: elem }, function(err){
			if(err){
				console.log('Error deleting song::: ' + err);
			}
			callback();
		});
	});
}

exports.findAll = function(req, res, callback) {
	db.collection('profiles', function(err, collection) {
		collection.find().toArray(function(err, items) {
			callback(req, res, items);
		});
	});
};

exports.addProfil = function(req, res, profil, callback) {
	db.collection('profiles', function(err, collection) {
		collection.insert(profil, {safe:true}, function(err, result) {
			callback();
		});
	});
}

exports.updateProfil = function(req, res, item, email, callback) {
	if(email == 0){
		email = req.session.email;
	}
	console.log("update: "+email);
	db.collection('profiles', function(err, collection) {
		collection.update({"email": email},{$set: item},{ upsert: true }, function(err, result) {
			if (err) {
				res.send({'error':'An error has occurred'});
			} 
			else {
				callback(req,res);
			}
		});
	});
}


exports.removeSong = function(req, res, sId, callback){
	if(sId != 0){
		sId = new ObjectID(sId);
		grid.remove(sId, function(err, result) {
			callback(req, res);
		});
	}
}


//////////////
// REQUESTS //
//////////////
exports.writeRequest = function(req, res) {
	var item = req.body;
	var time = process.hrtime();
	time = time[0];
	if(!req.session.spamTime || time >= req.session.spamTime + 50){
		var insert = {
			from: req.session.email
			, type: item.type
			, headline: item.headline
			, message: item.msg
			, time: time
		}
		if(item.msg.length >= 20){
			db.collection('requests', function(err, collection) {
				collection.insert(insert, {safe:true}, function(err, result) {
					req.session.spamTime = time;
					res.send({nr: "0", msg: "Deine Anfrage wurde gesendet !"});
				});
			});
		}
		else{
			res.send({nr: "1", msg: "Bitte gebe eine längere Beschreibung an"});
		}
	}
	else{
		var timeLeft = (req.session.spamTime + 50) - time;
		res.send({nr: "1", msg: "Bitte warte noch "+timeLeft+" Sekunden bis zu dem verschicken einer neuen Anfrage"});
	}
}

exports.albumNotification = function(req, res, payed, callback){
	var type = "album Notification";
	var time = process.hrtime();
	if(payed == 1){
		type = "payed";
	}
	var insert ={
		from: req.session.email
		,type: type
		,albumID: req.session.tempAlb
		,time: time

	}
	db.collection('requests', function(err, collection) {
		collection.insert(insert, {safe:true}, function(err, result) {
			callback(req, res);
		});
	});
}

exports.readRequest = function(req, res, pageNr, callback) {
	db.collection('requests', function(err, collection){
		if(err) throw err;
		collection.find().skip((pageNr-1)*10).limit(10).toArray(function(err, items) {
			if(items){
				callback(items);
			}
			else{
				callback(false);
			}
		});
	});
}

exports.writeMsg = function(req, res, to, msg, title, callback){
	exports.findByEmail(req, res, to, function(req,res,item){
		var stamp = new Date();
		var id = new ObjectID();
		var path = "messages.recieved."+id;
		var message = {};
		message = {
				title: title
				, from: "admin"
				, msg: msg
				, time: stamp
				, read: 0
			};

		var key = {};
		key[path] = message;

		exports.updateProfil(req, res, key, to, function(){
			callback();
		});
	});
}

exports.deleteReq = function(req, res, albumID, callback){
	db.collection('requests', function(err, collection){
		collection.remove({albumID: albumID}, function(err, result) {
			callback();
		});
	});
}


//////////
// News //
//////////

exports.writeNews = function(req, res) {
	if(req.session.account_state == "admin"){
		var item = req.body;
		var insert = { from: req.session.email,
						time: "timestamp",
						headline: item.headline,
						text: item.text };
		db.collection('news', function(err, collection){
			collection.insert(insert, {safe:true}, function(err, result) {
				res.send({nr: "0", msg: "News Posted"});
			});
		});
	}
	else{
		res.send({nr: "1", msg: "Don't Hack"});
	}
}

exports.readNews = function(req, res, amount, callback) {
	db.collection('news', function(err, collection){
		collection.find().limit(amount).toArray(function(err, items) {
				callback(items);
		});
	});
}

exports.deleteNews = function(req, res){
	if(req.session.account_state == "admin"){
		var bla = req.params.asd;
		//to string
		var idd = new ObjectID(bla);
		db.collection('news', function(err, collection){
			collection.remove({ "_id": idd }, function(err, result){ 
				if(err){
					res.send(err);
				}
				else{
					res.send({nr: "0", msg: "News Deleted"});
				}
			})
		});
	}
	else{
		res.send({nr: "1", msg: "Don't Hack"});
	}
}


/////////////
// Voucher //
/////////////

exports.createVoucher = function(req, res, callback){
	var id = new ObjectID();
	var buf = id.toString();
	buf = crypto.createHash('md5').update(buf).digest("hex");
	var code = buf.substr(0, 5)+"-"+buf.substr(5, 5); 


	var insert = { "_id": id, "code": code, "used": "0", "time": 0 };
	db.collection('vouchers', function(err, collection) {
		collection.insert(insert, {safe:true}, function(err, result) {
			res.send({nr: "0", msg: "Gutschein Erstellt: "+id});
		});
	});
}

exports.readVoucher = function(req, res, callback){
	db.collection('vouchers', function(err, collection) {
		collection.find().toArray(function(err, items) {
			console.log(items);
			callback(items);
		});
	});
}

exports.useVoucher = function(req, res){
	var id = req.body.gutscheinCode;
	db.collection('vouchers', function(err, collection) {
		collection.findOne({'code': id}, function(err, item) {
			if(item){
				if(item.used == 0){
					collection.update({'code': id },{$set: {"used": req.session.email}} , {safe:true}, function(err, result){
						funct.setPayed(req, res, function(){
							res.send({nr: "0", msg: "Sie haben mit dem Gutschein bezahlt"});
						});
					});
				}
				else{
					res.send({nr: "1", msg: "Gutschein wurde schon von "+item.used+" genutzt"});
				}
			}
			else{
				res.send({nr: "1", msg: "Kein echter Gutscheincode"});
			}
		});
	});
}

exports.getSetting = function(req, res, type, callback){
	db.collection('settings', function(err, collection) {
		collection.findOne({"type": type}, function(err, item){
			if(item){
				callback(item);
			}
			else{
				res.send({nr: "1", msg: "Error in DB"});
			}
		});
	});
}

//////////
// GRID //
//////////


//NonGrid
exports.getFileUser = function(req, res, name, callback){
	if(name == 0){
		name = "cover.jpg";
	}
	else{
		name += ".wav";
	}
	fs.readFile('./uploads/'+req.session.email+'/'+req.session.tempAlb+'/'+name, function(err, data){
		console.log(data);
		callback(data);
	});
}

exports.saveFileInDB = function(req, res, profile, filename, tag,  dataURL, callback){
	console.log('Adding data to Profile ' + JSON.stringify(profile));
	
	//readfile
	// if filename = filename => delete
	var GridWriter = new GridStore(db, filename, "w",
		{"chunkSize":1024, "metadata":{
								"Profile":profile,
								"filename":filename,
								"TAG":tag
								}
		});
	var GridReader = new GridStore(db, filename,"r");
	
	GridReader.open(function(err, gs) {
		GridReader.unlink(function(){
			GridWriter.close(function(err, result) {
				GridWriter.open(function(err, gridStore) {
					GridWriter.writeFile(dataURL, function(err){
						GridWriter.close(function(err, result) {
							if(err)
							{
								res.send({'error' : 'can`t save data in DB'});
							}
							else
							{
								
								callback(req, res);
							}
						
					 
						});
					});
				});
			});
		});
	});
}

exports.readFileFromDB_IMG = function(req, res, profile, filename, callback){
	
	
	var back = "";
	
	var GridReader = new GridStore(db, filename,"r");
	
	GridReader.open(function(err, gs) {

		GridReader.read(function(err, data) {
			if(data){
				back = data.toString('base64');
				GridReader.close(function(err, result) {
					callback(back);
				});
			}
			else{
				callback();
			}
		});
	});
}

exports.getSongs = function(req, res, name, isId, callback){
	var back = "";
	if(isId == 1){
		var id = new ObjectID(name);
	}
	else{
		var id = name;
	}
	var reader = new GridStore(db, id, "r");
	reader.open(function(err, gs) {
		reader.read(function(err, data){
			callback(data);
		});
	});
}

///////////
// Stats //
///////////

exports.getStat = function(req, res, callback){
	db.collection('stats', function(err, collection) {
		collection.findOne({}, function(err, item) {
			callback(item);
		});
	});
}

exports.setStat = function(req, res, key, add, callback){
	exports.getStat(req, res, function(item){
		var amount = item[key];
		console.log(key + "   " + add);
		item[key] = amount + add;

		db.collection('stats', function(err1, collection) {
			collection.update({"std": "std"}, item, function(err, result) {
				callback(item);
			});
		});
	});
}

exports.addArtStat = function(req, res, artist, callback){
	exports.getStat(req, res, function(item){
		var counter = 0;
		var itemSh = item.artists;
		var len = Object.keys(itemSh).length;
		var id = new ObjectID();
		
		console.log("=====");
		console.log(len+" . "+counter+" | "+artist);
		console.log(itemSh);
		console.log("!*!*!*!*!*");
		for(key in itemSh){
			console.log("FOR");
			if(item.artists[key].toLowerCase() == artist.toLowerCase()){
				res.send({nr: "1", msg: "Name schon vergeben"});
			}
			else{
				console.log("counter");
				counter++;
				if(counter == len){
					console.log("kurz vor callback");
					item.artists[id] = artist;
					db.collection("stats", function(err, collection){
						collection.update({"std": "std"}, item, function(err, result){
							console.log("callback");
							callback();
						});
					});
				}
			}
		}
	});	
}


//////////////
// Populate //
//////////////

var populateDB = function() {
 	console.log("**********************");
 	console.log("*** Populating DB ***");
 	console.log("**********************");

	var profil = {
		email: "pika"
		, main: {
			password: "melone"
			, balance: "0,00"
			, account_state: "admin"
			, language: 0
			, email_freischaltung: 0
			, tempAlb: ""
		}
		, message: {
			sent: {}
			, recieved: {}
		}
		, settings: {}
		, artists: {}
	};

	 db.collection('profiles', function(err, collection) {
		collection.insert(profil, {safe:true}, function(err, result) {});
	});

	var pricing = {
		type: "pricing"
		,EAN: 4
		,ISRC: 0
		,SONG: 2
	}

	db.collection('settings', function(err, collection) {

		collection.insert(pricing, {safe:true}, function(err, result) {});
	});
	var idd = new ObjectID();
	var stat = {
		user: 1
		, albums: 2
		, isrc: 0
		, ean: 2
		, std: "std"
		, artists: {}
	};
	stat.artists[idd] = "extize";

	db.collection('stats', function(err, collection) {
		collection.insert(stat, {safe:true}, function(err, result) {});
	}); 
};




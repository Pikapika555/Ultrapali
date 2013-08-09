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
	console.log('Retrieving profil: ' + mail);
	db.collection('profiles', function(err, collection) {
		collection.findOne({'email': mail}, function(err, item) {
			//console.log("PENIS");
			callback(req, res, item); //req, res, item!?
		});
	});
};


exports.findSpecific = function(req, res, elem, where, callback) {
	if(!req.session.email){
		var mail = req.body.email;
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
				console.log(item);
				console.log(elem);
				callback(item[elem]);
			}
			else{
				callback(false);
			}
		});
	});
};

exports.removeElem = function(req, res, elem, callback){
	var mail = req.session.email;
	//var search = {};
	//search[path] = elem;
	db.collection('profiles', function(err, collection) {
		collection.update({'email': mail}, { $unset: elem }, function(err){
			if(err){
				console.log('Error deleting song::: ' + err);
			}
			console.log("HIER");
			console.log(elem);
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
	console.log('Adding Profile: ' + JSON.stringify(profil));
	db.collection('profiles', function(err, collection) {
		collection.insert(profil, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				callback(req, res);
			}
		});
	});
}

exports.updateProfil = function(req, res, item, callback) {
	var email = req.session.email;
	console.log(item);
	db.collection('profiles', function(err, collection) {
		collection.update({"email": email},{$set: item}, function(err, result) {
			if (err) {
				console.log('Error updating profil: ' + err);
				res.send({'error':'An error has occurred'});
			} 
			else {
				console.log('' + result + ' document(s) updated');
				callback(req,res);
			}
		});
	});
}


//////////////
// REQUESTS //
//////////////
exports.writeRequest = function(req, res) {
	var item = req.body;
	var time = process.hrtime();
	time = time[0];
	console.log("b4 if");
	if(!req.session.spamTime || time >= req.session.spamTime + 50){
		console.log("if");
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
					res.send({nr: "0", msg: "Your Request has been sent !"});
				});
			});
		}
		else{
			console.log("else");
			res.send({nr: "1", msg: "Please enter larger description"});
		}
	}
	else{
		console.log("e else");
		var timeLeft = (req.session.spamTime + 50) - time;
		res.send({nr: "1", msg: "Please Wait "+timeLeft+" seconds"});
	}
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

//////////
// GRID //
//////////
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
								res.send({'error' : 'Error can`t save data in DB'});
							}
							else
							{
								console.log('Data is added');
								
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
	
	
	console.log('Find data from Profile ' + JSON.stringify(profile));
	var back = "";
	
	var GridReader = new GridStore(db, filename,"r");
	
	GridReader.open(function(err, gs) {
	
		//ermöglicht das spulen in den soundfiles
		GridReader.seek(0, function() {
	
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
	});
}



var populateDB = function() {
 
	var profil = [
	{
		email: "Pika@gmx.de",
		pass: "pika"
	}];

	 db.collection('profiles', function(err, collection) {
		collection.insert(profil, {safe:true}, function(err, result) {});
	});
};




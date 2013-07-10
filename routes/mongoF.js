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
	var id = req.session.id;
	console.log('Updating profil: ' + id);
	console.log(JSON.stringify(item));
	db.collection('profiles', function(err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, item, {safe:true}, function(err, result) {
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



exports.saveFileInDB = function(req, res, profile, filename, tag,  dataURL, callback){
	console.log('Adding data to Profile ' + JSON.stringify(profile));
	
	
	var GridWriter = new GridStore(db, filename, "w",
		{"chunkSize":1024, "metadata":{
								"Profile":profile,
								"filename":filename,
								"TAG":tag
								}
		});
	
	GridWriter.open(function(err, gridStore) {
	
		GridWriter.writeFile(dataURL, function(err, GridWirter){
			if(err)
			{
				res.send({'error' : 'Error can`t save data in DB'});
			}
			else
			{
				console.log('Data is added');
				callback(req, res);
			}
			
			GridWriter.close(function(err, result) {
			});
		});
	});
}

exports.readFileFromDB = function(req, res, profile, filename, tag, outdir, seek, callback){
	console.log('Find data from Profile ' + JSON.stringify(profile));
	
	//Öffnet das file
	var GridReader = new GridStore(db, filename,"r");
	
	GridReader.open(function(err, gs) {
	
		//ermöglicht das spulen in den soundfiles
		GridReader.seek(seek, function() {
		
			GridReader.read(function(err, data) {
			
				//data enthält den stream 
				
				
				GridReader.close(function(err, result) {
				});
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




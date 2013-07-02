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
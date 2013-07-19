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


exports.findSpecific = function(req, res, elem, callback) {
	if(!req.session.email){
		var mail = req.body.email;
	}
	else{
		var mail = req.session.email;
	}
	var search = {};
	search[elem] = 1;
	db.collection('profiles', function(err, collection) {
		collection.findOne({'email': mail}, search, function(err, item) {
			callback(req, res, item[elem]);
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
	//req.session.RequestSpam = timecode // muss eine minute dazwischen vergangen sein
	var insert = {
		from: req.session.email
		, request: item.type
		, message: item.msg
		, time: "" //timecode
	}
	if(item.bla.length >= 20){
		db.collection('requests', function(err, collection) {
			collection.insert(insert, {safe:true}, function(err, result) {
				res.send({nr: "0", msg: "Your Request has been sent !"});
			});
		});
	}
	else{
		res.send({nr: "1", msg: "Please enter larger description"});
	}
}

exports.readRequest = function(req, res, pageNr, callback) {
	db.collection('requests', function(err, collection){
		collection.find().skip((pageNr-1)*10).limit(10).toArray(function(err, items) {
			callback(items);
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

exports.readFileFromDB_IMG = function(req, res, profile, filename, dataURL, callback){
	fs.unlink(dataURL, function(){
	});
	console.log('Find data from Profile ' + JSON.stringify(profile));
	var back = "";
	//Öffnet das file
	/*var GridReader = new GridStore(db, filename,"r");
	
	GridReader.open(function(err, gs) {
		
		var streamFile = gs.stream(true);
		var string = "";
		streamFile.on("data", function(chunk){
			
		});
		
		streamFile.on("end", function(){
			
		});
		
        // Pipe out the data
		
        streamFile.pipe(res);
	GridReader.close(function(err, result) {
		
	});	*/	
		
		
		var GridReader = new GridStore(db, filename,"r");
		
		GridReader.open(function(err, gs) {
		
			//ermöglicht das spulen in den soundfiles
			GridReader.seek(0, function() {
		
				GridReader.read(function(err, data) {
			
				//data enthält den stream 
					back = data.toString('base64');
				
					GridReader.close(function(err, result) {
						res.send(back);
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




var express = require('express');
var app = express();
var port = 16789;
const MongoClient = require('mongodb').MongoClient;
var db;
MongoClient.connect('mongodb://localhost:27017/Proj1', (err,database) =>{
	if(err) {
		return console.log(err);
	}
	db = database;
	app.listen(port, function(){
		console.log('app.js test');
	})
})

app.get('/', function(req,res){
});
app.get('/search', (req,res) => {
	var zip = req.query.zip; //get the variable
	db.collection('Zip', function(err, collection){
		collection.findOne({'_id':zip}, function(err, zipItem){
			var lat = zipItem.loc[1];
			var lon = zipItem.loc[0];
			var objArr = [];
			db.command({geoNear: "Ufo", near:{type:"Point", coordinates:[lon, lat]}, spherical:true}, function(err, result){
				//db command is wrapping the documents in objects, getting them out here
				for (var i = 0; i < result.results.length; i++) {
					objArr.push(result.results[i].obj);
				}
				res.send(objArr);
			});
			//res.send(zipItem);
			//db.collection
		});
	});
});
app.get('/all', (req,res) => {
	db.collection('Ufo', function(err,collection){
		collection.find().limit(1000).toArray(function(err, items){
			res.send(items);
		});
	});
	//var cursor = db.collection('Ufo').find().toArray(function(err, results){
		//console.log(results[0]);
});
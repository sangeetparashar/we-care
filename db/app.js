//set up mongoose connection 
var mongoose = require('mongoose');
var mongoDB = 'mongodb://admin:admin@ds117888.mlab.com:17888/deltahacksdata'; //url
mongoose.connect(mongoDB, {
	useMongoClient: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



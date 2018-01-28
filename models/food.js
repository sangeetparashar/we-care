const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const moment = require('moment');

mongoose.connect('mongodb://admin:admin@ds117888.mlab.com:17888/deltahacksdata');

var Schema = mongoose.Schema;

var foodSchema = new Schema({
	title: {type: String, required: true},
	poster: {type: String, required: true}, 
	timesinceposting: {type: Date, default: moment().format('MMMM Do YYYY, h:mm:ss a')},
	expirytime: {type: Date, required: true },
});

foodSchema.virtual('url').get(function(){
	return '/postfood/';

})

//var foodSchema = mongoose.model('images', foodSchema);

// app.use(multer({
// 	dest: './uploads/', rename: function(fieldname, filename){
// 		return filename;
// 	}, 
// }));

// app.post('/api/photo', function(req, res){
// 	var foodSchema = new foodSchema();
// 	foodSchema.img.data = fs.readFileSync(req.files.userPhoto.path);
// 	foodSchema.img.contentType='image/png';
// 	foodSchema.save();
// });

var food = mongoose.model('Food', foodSchema);

module.exports = {
	food
};
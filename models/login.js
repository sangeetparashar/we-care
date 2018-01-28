var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var loginSchema = new Schema({
	name:{ type: String, required:true},
	location: { type: String, required:true},
	identity: {type: String, required: true, enum: ['organization', 'character']},
	ratings: {type: Number, min: 1, max: 5}

});

loginSchema.virtual('url').get(function(){
	return '/login/'+this._id;
})

module.exports = mongoose.model('Login', loginSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BookSchema = new Schema({
  title: {type: String, required: true},
  author: {type: Schema.ObjectId, ref: 'Author', required: true},
  summary: {type: String, required: true},
  isbn: {type: String, required: true},
  genre: [{type: Schema.ObjectId, ref: 'Genre'}]
});

//virtual for book's url
BookSchema.virtual('url').get(function(){
	return '/catalog/book/'+this._id;
});

//Export Model
module.exports = mongoose.model('Book', BookSchema);

//author is a reference to a single Author model object that's why
// its type is Schema.ObjectID, and has a ref: Author

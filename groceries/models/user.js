var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: String,
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    recipes: [{ url: String, title: String }],
    ingredients: [
      { name: String, aisle: String, quantity: String, unit: String, recipeId: Schema.ObjectId }
    ]
});

module.exports = mongoose.model('User', UserSchema);

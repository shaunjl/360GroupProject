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
    ],
    combinedIngredients: [
      { name: String, aisle: String, quantities: [{unit: String, quantity: String}] }
    ]
});

module.exports = mongoose.model('User', UserSchema);

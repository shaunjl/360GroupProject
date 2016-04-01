var mongoose = require('mongoose');
/*
module.exports = mongoose.model('User',{
    id: String,
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    recipes: [{ url: String, title: String }],
    ingredients: [{ name: String, aisle: String, quantity: String, unit: String }]
});
*/
var UserSchema = new mongoose.Schema({
    id: String,
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    recipes: [{ url: String, title: String }],
    ingredients: [{ name: String, aisle: String, quantity: String, unit: String }]
});

UserSchema.methods.addRecipe = function(recipe, cb) {
  console.log(recipe);
  // add recipe
  var rObj = {url: recipe.sourceUrl, title: recipe.title}
  this.recipes.push(rObj);
  // add ingredients
  // TODO
  this.save(cb);
};

module.exports = mongoose.model('User', UserSchema);

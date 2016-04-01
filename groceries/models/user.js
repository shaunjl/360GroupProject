var mongoose = require('mongoose');

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

module.exports = mongoose.model('User', UserSchema);

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var unirest = require('unirest');

var isLoggedin = function (req, res, next) {
if (req.isAuthenticated())
    return next();
res.sendfile('views/login.html');
}

module.exports = function(passport){

/* GET login page. */
router.get('/', isLoggedin, function(req, res){
    res.sendfile('views/index.html');
});

/* Handle Login POST */
router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/'
}));

/* GET Registration Page */
router.get('/signup', function(req, res){
    res.sendfile('views/signup.html');
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup'
}));

/* Handle Logout */
router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/user',isLoggedin, function(req, res){
     console.log(req.session.passport.user)
     console.log(req.user)
     User.findById(req.session.passport.user, function(err, user) {
        console.log('deserializing user:',user);
        res.json(user);
    });
});

router.get('/recipefromurl',isLoggedin,function(req,res,next){
    console.log(req.query)
    var url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?forceExtraction=false&url=" + encodeURIComponent(req.query.url)
    console.log(url)
    unirest.get(url)
        .header("X-Mashape-Key", "syMrIkEfZUmshCO3nkdEO5DN4UENp1uAQvujsnMqDOGOwJOOXS")
        .end(function (result) {
            console.log(result.status, result.headers, result.body);
            if(result.status == 200){
                res.status(200).json(result.body);
            } else {
                res.status(404).json({'message': result.body.message});
            }
	});
 });

router.get('/recipesfromparams',isLoggedin,function(req,res,next){
    var url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/ingredients/autocomplete"
    url += '?cuisine=' + encodeURIComponent(req.query.cuisine)
    url += '&diet=' + encodeURIComponent(req.query.diet)
    url += '&intolerances=' + encodeURIComponent(req.query.intolerances.join())
    url += '&query=' + encodeURIComponent(req.query.query)
    url += '&type=' + encodeURIComponent(req.query.type)    
    console.log(url)
    unirest.get(url)
        .header("X-Mashape-Key", "syMrIkEfZUmshCO3nkdEO5DN4UENp1uAQvujsnMqDOGOwJOOXS")
        .end(function (result) {
            console.log(result.status, result.headers, result.body);
            if(result.status == 200){
                res.status(200).json(result.body);
            } else {
                res.status(404).json({'message': result.body.message});
            }
        });
 })

router.get('/autocomplete',isLoggedin, function(req,res,next){
    var url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/ingredients/autocomplete?query=" + encodeURIComponent(req.query.query)
    console.log(url)
    unirest.get(url)
        .header("X-Mashape-Key", "syMrIkEfZUmshCO3nkdEO5DN4UENp1uAQvujsnMqDOGOwJOOXS")
        .end(function (result) {
            console.log(result.status, result.headers, result.body);
            if(result.status == 200){
                res.status(200).json(result.body);
            } else {
                res.status(404).json({'message': result.body.message});
            }
        });
 });

return router;
}

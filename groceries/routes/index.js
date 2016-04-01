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
    var url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?limitLicense=false&number=10&offset=0&ranking=1"
    if (req.query.cuisine !== ""){url += '&cuisine=' + encodeURIComponent(req.query.cuisine) }
    if (req.query.diet !== ""){url += '&diet=' + encodeURIComponent(req.query.diet) }
    if (req.query.intolerance !== ""){ url += '&intolerances=' + encodeURIComponent(req.query.intolerance) }
    if (req.query.keywords !== ""){ url += '&query=' + encodeURIComponent(req.query.keywords) }
    if (req.query.mealType !== ""){ url += '&type=' + encodeURIComponent(req.query.mealType) }
    if (req.query.includeIngredient !== ""){ url += '&includeIngredients=' + encodeURIComponent(req.query.includeIngredient) }
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

router.get('/spoonRecipe',isLoggedin, function(req,res,next){
    var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/' + req.query.id + '/information?includeNutrition=false'
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

 router.post('/recipe', isLoggedin, function (req, res) {
   var rawRecipe = req.body;
   User.findById(req.session.passport.user)
   .then(function (user) {
     var recipe = { url: rawRecipe.sourceUrl, title: rawRecipe.title };
     user.recipes.push(recipe)
     return user.save();
   })
   .then(function (user) {
     var recipeId = user.recipes[user.recipes.length - 1]._id;
     rawRecipe.extendedIngredients.forEach(function (ingredient) {
       var newIngredient = {
         name: ingredient.name,
         aisle: ingredient.aisle,
         quantity: ingredient.amount,
         unit: ingredient.unitShort,
         recipeId: recipeId,
       }
       user.ingredients.push(newIngredient);
     });
     return user.save();
   })
   .then(function (user) {
     return res.send(user);
   })
   .catch(function (error) {
     console.log(error);
     res.sendStatus(500);
   });
 })

 router.delete('/recipes/:id', isLoggedin, function (req, res) {
   var recipeId = req.params.id;
   User.findById(req.session.passport.user)
   .then(function (user) {
     console.log('BEFORE')
     console.log(user.ingredients)
     user.recipes.pull({ _id: recipeId });
     user.ingredients = user.ingredients.filter(function (ingredient) {
       return ingredient.recipeId.toString() !== recipeId;
     });
     console.log('AFTER')
     console.log(user.ingredients)
     return user.save();
   })
   .then(function (user) {
     return res.send(user);
   })
   .catch(function (error) {
     console.log(error);
     res.sendStatus(500);
   });
 });

 router.delete('/recipes', isLoggedin, function (req, res) {
   User.findById(req.session.passport.user)
   .then(function (user) {
     user.recipes = [];
     user.ingredients = [];
     return user.save();
   })
   .then(function (user) {
     return res.send(user);
   })
   .catch(function (error) {
     console.log(error);
     res.sendStatus(500);
   });
 });

 return router;
}

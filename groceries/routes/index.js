var express = require('express');
var router = express.Router();

var isLoggedin = function (req, res, next) {
if (req.isAuthenticated())
    return next();
res.sendfile('views/login.html');
}

module.exports = function(passport){

/* GET login page. */
router.get('/', isLoggedin, function(req, res){
    res.sendfile('views/info.html');
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

router.get('/getrecipe',function(req,res,next){
    var url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?forceExtraction=false&url=" + encodeURIComponent(req.query.q)
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
 //://itunes.apple.com/us/album/ghetto-d-10th-anniversary/id715827364       });
	});
 })

   return router;
}

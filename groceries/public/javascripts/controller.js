var app =angular.module('app', [])
app.controller('MainCtrl', [
  '$scope','$http',
  function($scope,$http){
    $scope.hideForms = false;
    $scope.hideSuggestion = true; 
//    $scope.staticRecipe = [{url:"http://allrecipes.com/recipes/669/meat-and-poultry/pork/bacon/"];
//var person = {firstName:"John", lastName:"Doe", age:46};

//ON PAGE LOAD
  angular.element(document).ready(function () { 
      return $http.get('/user').success(function(data){
	$scope.user=data;
	 console.log($scope.user);
      });
    });

 $scope.clearForms = function() {
  console.log("clearing forms");
  $scope.formRecipeUrl = '';
 }

//GET RECIPE BY URL
 $scope.recipeFromUrl = function() {
	$scope.hideForms = true;
	console.log("THE USER URL: "+ $scope.formRecipeUrl);
    return $http.get('/recipefromurl?url=' + encodeURIComponent($scope.formRecipeUrl)).success(function(data){
        $scope.recipe = data;
        $scope.hideForms = true;      
        $scope.hideSuggestion = false;	
        console.log("TITLE: "+data.title)
	console.log("SOURCE URL: "+data.sourceUrl);
    });
  };

//GET RECIPE BY INPUTS
  $scope.recipeFromParams = function() {
	
	var cuisine = $scope.cuisine;
        var diet = $scope.diet;
        var tolerances = $scope.tolerances;
        var meal = $scope.meal;
        var type = $scope.type;
	
	console.log(cuisine);
        console.log(diet);
        console.log(tolerances);
        console.log(meal);
        console.log(type);

    return $http.get('/recipesfromparams?url=' + encodeURIComponent($scope.formRecipeUrl)).success(function(data){

    });
  };
  
  $scope.addRecipeToUser = function() {
    return $http.post('/recipe', $scope.recipe).success(function(data){
        $scope.hideForms = false;
        $scope.hideSuggestion = true;
    }); 
  };

  $scope.cancelAddRecipe = function() {
    $scope.hideForms = false;
    $scope.hideSuggestion = true;
  };

  }
]);


var app = angular.module('app', []);
app.controller('MainCtrl', [
  '$scope','$http',
  function($scope,$http) {
    $scope.cuisineItems = ["None", "african", "chinese", "japanese", "korean", "vietnamese", "thai", "indian", "british", "irish", "french", "italian", "mexican", "spanish", "middle eastern", "jewish", "american", "cajun", "southern", "greek", "german", "nordic", "eastern european", "caribbean", "latin american"];
    $scope.dietItems = ["None", "pescetarian", "lacto vegetarian", "ovo vegetarian", "vegan", "paleo", "primal", "vegetarian"];
    $scope.intoleranceItems = ["None", "dairy", "egg", "gluten", "peanut", "sesame", "seafood", "shellfish", "soy", "sulfite", "tree nut", "wheat"];
    $scope.mealTypeItems = ["None", "main course", "side dish", "dessert", "appetizer", "salad", "bread", "breakfast", "soup", "beverage", "sauce", "drink"];

    $scope.hideForms = false;
    $scope.hideSuggestion = true; 
    $scope.hideMultiSuggestions = true; 

    $scope.showForms = function () {
      $scope.hideForms = false;
      $scope.hideSuggestion = true;
      $scope.hideMultiSuggestions = true;
    }

    $scope.showMultiSuggestion = function() {
      $scope.hideForms = true;
      $scope.hideSuggestion = true;
      $scope.hideMultiSuggestions = false;
    }

    $scope.showSuggestion = function () {
      $scope.hideForms = true;
      $scope.hideSuggestion = false;
      $scope.hideMultiSuggestions = true;
    }

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
      console.log("THE USER URL: "+ $scope.formRecipeUrl);
      return $http.get('/recipefromurl?url=' + encodeURIComponent($scope.formRecipeUrl)).success(function(data){
        $scope.recipe = data;
        $scope.showSuggestion();
        console.log("TITLE: "+data.title)
        console.log("SOURCE URL: "+data.sourceUrl);
      });
    };

    //GET RECIPE BY INPUTS
    $scope.recipeFromParams = function() {

      var url = '/recipesfromparams?';
      if ($scope.cuisine !== undefined && $scope.cuisine !== "None"){
        url += 'cuisine=' + encodeURIComponent($scope.cuisine);
      } else {
        url += 'cuisine=' + encodeURIComponent("");
      }
      if ($scope.diet !== undefined && $scope.diet !== "None"){
        url += '&diet=' + encodeURIComponent($scope.diet);
      } else {
        url += '&diet=' + encodeURIComponent("");
      }
      if ($scope.intolerance !== undefined && $scope.intolerance !== "None"){      
        url += '&intolerance=' + encodeURIComponent($scope.intolerance);
      } else {
        url += '&intolerance=' + encodeURIComponent("");
      }
      if ($scope.mealType !== undefined && $scope.mealType !== "None"){
        url += '&mealType=' + encodeURIComponent($scope.mealType);
      } else {
        url += '&mealType=' + encodeURIComponent("");
      }
      if ($scope.keywords !== undefined && $scope.keywords !== "None"){
        url += '&keywords=' + encodeURIComponent($scope.keywords);
      } else {
        url += '&keywords=' + encodeURIComponent("");
      }
      if ($scope.includeIngredient !== undefined && $scope.includeIngredient !== "None"){
        url += '&includeIngredient=' + encodeURIComponent($scope.includeIngredient);
      } else {
        url += '&includeIngredient=' + encodeURIComponent("");
      }
      return $http.get(url).success(function(data){
        console.log('returned!');
        console.log(data);
        $scope.multiSuggestions = data.results; 
        $scope.showMultiSuggestion();
      });
    }

    $scope.chooseRecipe = function() {
      console.log('suggestedChoice:');
      console.log($scope.suggestedChoice);
      return $http.get('/spoonRecipe?id=' + $scope.suggestedChoice).success(function (recipe) {
        return $http.post('/recipe', recipe).success(function (user) {
        $scope.showForms();
        $scope.user = user;
        });
      });
    };

    $scope.cancelAddRecipe = function() {
      $scope.showForms();
    };

    $scope.addRecipeToUser = function () {
      return $http.post('/recipe', $scope.recipe).success(function (user) {
        $scope.showForms();
        $scope.user = user;
      }); 
    };

    $scope.deleteRecipe = function (id) {
      return $http.delete('/recipes/' + id).success(function (user) {
        $scope.user = user;
      });
    };

    $scope.deleteAllRecipes = function (id) {
      return $http.delete('/recipes').success(function (user) {
        $scope.user = user;
      });
    };

  }
]);


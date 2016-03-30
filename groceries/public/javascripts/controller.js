var app =angular.module('app', [])
app.controller('MainCtrl', [
  '$scope','$http',
  function($scope,$http){
   
//    $scope.staticRecipe = [{url:"http://allrecipes.com/recipes/669/meat-and-poultry/pork/bacon/"];
//var person = {firstName:"John", lastName:"Doe", age:46};

//ON PAGE LOAD
  angular.element(document).ready(function () { 
      return $http.get('/user').success(function(data){
	$scope.user=data;
	 console.log($scope.user);
      });
    });

 $scope.recipeFromUrl = function(url) {
	console.log("THE USER URL: "+url);
    return $http.post('/recipefromurl?url=' + encodeURIComponent(url)).success(function(data){
      $scope.comments.push(data);
    });
  };



  }
]);


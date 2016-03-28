angular.module('app', [])
.controller('MainCtrl', [
  '$scope','$http',
  function($scope,$http){
    $scope.test = 'Hello world!';
    
    $scope.getLoggedInUser = function() {
      return $http.get('/').success(function(data){
         $scope.test=data;
	//angular.copy(data, $scope.songs);
      });
    };
   // $scope.getAll

  }
]);


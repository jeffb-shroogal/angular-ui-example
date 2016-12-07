var myApp = angular.module('myApp', ['ngRoute', 'myAppControllers', 'ngAnimate']);

var myAppControllers = angular.module('myAppControllers', ['ui.bootstrap']);

myAppControllers.controller('uidemo', ['$scope', function($scope ) {
  $scope.test = "This works!"
}]);


// Please put the new directives in this file

var myApp = angular.module('myApp', ['ngRoute','ngAnimate']);


myApp.controller('uidemo', ['$scope', function($scope ) {
  $scope.gender = 'female';
  $scope.secondOptions = ['Mr.','Mrs.','Miss.','Ms.','Dr.','Prof.'];
  $scope.doChange = function() {
    $scope.secondOptions = ['Yes','No'];
  }
}]);


myApp.directive('radios',[function(){
  return {
    require: '^ngModel',
    replace: true,
    scope:{
      options: "=",
    },
    templateUrl:"partials/radioTemplate.html",
    link: function(scope, element, attrs , ngModel){
      if( scope.options != undefined && scope.options.length > 1)
      {
        //initialize variables
        scope.checked = undefined;

        //handel the check
        scope.check = function(option) {
          ngModel.$setViewValue(option);
          ngModel.$modelValue = option
          scope.checked = option;
        }

        ngModel.$formatters.push(function(value){
          if(value != undefined) {
            scope.check(value);
          }
          return value;
        });
      }
    }
  }
}]);

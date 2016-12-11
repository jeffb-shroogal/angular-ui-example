var myApp = angular.module('myApp', ['ngRoute','ngAnimate']);


myApp.controller('uidemo', ['$scope', function($scope) {

  // radios
  $scope.gender = 'female';
  $scope.secondOptions = ['Mr.','Mrs.','Miss.','Ms.','Dr.','Prof.'];
  $scope.doChange = function() {
    $scope.secondOptions = ['Yes','No'];
  }

  //datePicker
  $scope.DOB = new Date();

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



myApp.directive('datePicker',[function(){
  return {
    require: '^ngModel',
    replace: true,
    scope:{
      startYear: "@",
      decades:"@"
    },
    templateUrl:"partials/datePickerTemplate.html",
    link: function(scope, element, attrs , ngModel){

      //initialize variables
      scope.index = 0 ;
      scope.years = [];
      scope.months = [];
      scope.days = [];
      scope.droppedYear = false;
      scope.droppedMonth = false;
      scope.droppedDay = false;

      //ensure scope variables are numebers
      scope.startYear = Number(scope.startYear);
      scope.decades = Number(scope.decades);

      //initialize the years array
      if(angular.isNumber(scope.startYear) && angular.isNumber(scope.decades)){
        for(var i=0; i<scope.decades; i++) {
          scope.years[i] = [];
          for(var j=0; j<=9; j++) {
            scope.years[i].push(scope.startYear+(i*10)+j);
          }
        }
      }

      //previous
      scope.prev = function() {
        if (scope.index == 0) {
          scope.index = scope.decades - 1
        }
        else {
          scope.index = scope.index - 1;
        }
      }

      //next
      scope.next = function() {
        if (scope.index == scope.decades - 1) {
          scope.index = 0
        }
        else {
          scope.index = scope.index + 1;
        }
      }

      //set year
      scope.setYear = function(year) {
        scope.selectedYear = year;
        scope.droppedYear = false;
      }




    // ************************** month ****************************

      //initialize months
      scope.months =
        ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      //set month
      scope.setMonth = function(month) {
        scope.selectedMonth = month;
        scope.droppedMonth = false;
        updateDays();
      }



    // ************************** day ****************************
      function updateDays() {
          daysInMonth = 31;
          if (scope.selectedMonth == "Feb") {
              daysInMonth = 28;
          } else if (["Sep", "Apr", "Jun", "Nov"].indexOf(scope.selectedMonth) > -1) {
              daysInMonth = 30;
          }
          scope.days = [];
          for (var i = 1; i <= daysInMonth; i++) {
              scope.days.push(i);
          }
      }

      //initialize days
      updateDays();

      //set month
      scope.setDay = function(day) {
        scope.selectedDay = day;
        scope.droppedDay = false;
      }



    // ************************** formatters ************************
      ngModel.$formatters.push(function(date) {
          console.log("formatters");
          if(date != undefined) {
            scope.selectedDay = date.getDate();
            scope.selectedMonth = scope.months[date.getMonth()];
            scope.selectedYear = date.getFullYear();
          }
          return date;
      });


    // ************************** parser ************************
    scope.$watch('selectedYear + selectedMonth + selectedDay', function() {
          console.log("watch");
          if(scope.selectedYear && scope.selectedMonth && scope.selectedDay) {
            var tempDate =  scope.selectedDay + " " + scope.selectedMonth+ " " + scope.selectedYear;
            console.log(tempDate);
            console.log(new Date(tempDate));
            ngModel.$setViewValue(new Date(tempDate));
          }
    });

    }
  }
}]);

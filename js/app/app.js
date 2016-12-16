var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate']);


myApp.controller('uidemo', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

  // radios
  $scope.gender = 'female';
  $scope.secondOptions = ['Mr.', 'Mrs.', 'Miss.', 'Ms.', 'Dr.', 'Prof.'];
  $scope.doChange = function() {
    $scope.secondOptions = ['Yes', 'No'];
  }

  //datePicker
  $scope.DOB = undefined;

  $scope.countries = [];
  $scope.states = [];
  $scope.country = 'Australia';
  $scope.state = 'Victoria';
  $scope.showState = false;

  $scope.updateStates = function() {
    $scope.states = [];
    // Find the correct filename from countriesData json
    angular.forEach($scope.countriesData, function(countryInfo) {
      if (countryInfo.name == $scope.country) {
        if (countryInfo.filename) {
          $http.get('https://raw.githubusercontent.com/astockwell/countries-and-provinces-states-regions/master/countries/' + countryInfo.filename + '.json').then(function(response) {
            $scope.statesData = response.data;
            angular.forEach($scope.statesData, function(state) {
              $scope.states.push(state.name);
            });
            $scope.showState = true;
          }, function() {
            // Http Error Handling Here
          });
        } else {
          // No states to display
          $scope.showState = false;
        }
      }
    });
  }

  // Load the Countries
  $http.get('https://raw.githubusercontent.com/astockwell/countries-and-provinces-states-regions/master/countries.json').then(function(response) {
    // Store the JSON for later
    $scope.countriesData = response.data;
    // Clear the array of countries
    $scope.countries = [];
    angular.forEach($scope.countriesData, function(country) {
      // Add the name of the country
      $scope.countries.push(country.name);
    });
    // Update the states select
    $scope.updateStates();
  }, function() {
    // Http Error Handling Here
  });
}]);



myApp.directive('radios', [function() {
  return {
    require: '^ngModel',
    replace: true,
    scope: {
      options: "=",
    },
    templateUrl: "partials/radioTemplate.html",
    link: function(scope, element, attrs, ngModel) {
      if (scope.options != undefined && scope.options.length > 1) {
        //initialize variables
        scope.checked = undefined;

        //handel the check
        scope.check = function(option) {
          ngModel.$setViewValue(option);
          ngModel.$modelValue = option
          scope.checked = option;
        }

        ngModel.$formatters.push(function(value) {
          if (value != undefined) {
            scope.check(value);
          }
          return value;
        });
      }
    }
  }
}]);

myApp.directive('datePicker', [function() {
  return {
    require: '^ngModel',
    replace: true,
    scope: {
      startYear: "@",
      decades: "@"
    },
    templateUrl: "partials/datePickerTemplate.html",
    link: function(scope, element, attrs, ngModel) {

      //initialize variables
      scope.index = 0;
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
      if (angular.isNumber(scope.startYear) && angular.isNumber(scope.decades)) {
        for (var i = 0; i < scope.decades; i++) {
          scope.years[i] = [];
          for (var j = 0; j <= 9; j++) {
            scope.years[i].push(scope.startYear + (i * 10) + j);
          }
        }
      }

      //previous
      scope.prev = function() {
        if (scope.index == 0) {
          scope.index = scope.decades - 1
        } else {
          scope.index = scope.index - 1;
        }
      }

      //next
      scope.next = function() {
        if (scope.index == scope.decades - 1) {
          scope.index = 0
        } else {
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
      scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
        if (date != undefined) {
          scope.selectedDay = date.getDate();
          scope.selectedMonth = scope.months[date.getMonth()];
          scope.selectedYear = date.getFullYear();
        }
        return date;
      });


      // ************************** parser ************************
      scope.$watch('selectedYear + selectedMonth + selectedDay', function() {
        if (scope.selectedYear && scope.selectedMonth && scope.selectedDay) {
          var tempDate = scope.selectedDay + " " + scope.selectedMonth + " " + scope.selectedYear;
          ngModel.$setViewValue(new Date(tempDate));
        }
      });

    }
  }
}]);

myApp.directive('customSelect', ['$timeout',function($timeout) {
  return {
    require: '^ngModel',
    replace: true,
    scope: {
      options: "=",
      placeHolder: "@"
    },
    templateUrl: "partials/selectTemplate.html",
    link: function(scope, element, attrs, ngModel) {

      //initialize variables
      scope.showOption = false;
      scope.filteredOptions = [];

      //select event function
      scope.selectOption = function(option) {
        ngModel.$setViewValue(option);
        scope.selectedOption = option;
        scope.showOptions = false;
      }

      //hide options
      scope.toggleOptionsFn = function() {
        //toggle the option list
        scope.showOptions = !scope.showOptions;
        //set focus to the input tage
        var input = undefined;
        if (scope.showOptions) {
          try {
            input = element[0].children[0].children[0];
            if(input.tagName == "INPUT") {
              input.focus();
            }
          } catch (ex) {
            console.log("can't access the input element in the custom select");
          }
        }
      }

      //hide options
      scope.hideOptions = function() {
        $timeout(function() {
          scope.showOptions = false
        },100);
      }

      //filter the select options
      scope.filterOptions = function() {
        if (scope.selectedOption != undefined || scope.selectedOption != '') {
          scope.filteredOptions = [];
          var kewywordRex = new RegExp(scope.selectedOption, 'i');
          for (var i = 0; i < scope.options.length; i++) {
            if (kewywordRex.test(scope.options[i])) {
              scope.filteredOptions.push(scope.options[i]);
            }
          }
        }
      }

      // ************************** formatters ************************
      ngModel.$formatters.push(function(option) {
        scope.selectOption(option);
        return option;
      });

      // ************************* watch options **********************
      scope.$watch('options', function(){
        scope.filteredOptions = scope.options;
      })

    }
  }
}]);

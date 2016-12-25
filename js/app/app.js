var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate']);


myApp.controller('uidemo', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

  // radios
  $scope.gender = 'female';
  $scope.secondOptions = ['Mr.', 'Mrs.', 'Miss.', 'Ms.', 'Dr.', 'Prof.'];
  $scope.doChange = function() {
    $scope.secondOptions = ['Yes', 'No'];
  }

  //sdatePicker
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
            if($scope.states.indexOf($scope.state) == -1){
              $scope.state = $scope.states[0];
            }
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
          scope.checked = option;
        }

        //render
        ngModel.$render = function() {
          scope.check(ngModel.$viewValue);
        }
      }
    }
  }
}]);


myApp.directive('datePicker', ['$timeout',function($timeout) {
  return {
    require: 'ngModel',
    replace: true,
    scope: {
      startYear: "@",
      endYear: "@"
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
      scope.minYear = undefined;
      scope.maxYear = undefined;
      var yearInput = undefined;
      var monthInput = undefined;
      var dayInput = undefined;
      var blur = false;

      //ensure scope variables are numebers
      scope.startYear = Number(scope.startYear);
      scope.endYear = Number(scope.endYear);

      //initialize the years array
      if (angular.isNumber(scope.startYear) && angular.isNumber(scope.endYear)) {
        var yearsDiff = scope.endYear - scope.startYear;
        for (var i = 0; i < yearsDiff+1; i++) {
          scope.years.push(scope.endYear-i);
        }
      }

      //set the min year and max year
      // min is the star year by default
      // max is the start year +5 or the end year
      scope.minYear = scope.startYear;
      if(scope.startYear + 4 < scope.endYear){
        scope.maxYear = scope.startYear + 4;
      }
      else {
        scope.maxYear = scope.endYear;
      }
      var yearInputFocus = function(){
        try {
          if(yearInput == undefined) {
              yearInput = element[0].children[0].children[0].children[0];
          }
          if(yearInput.tagName == "INPUT") {
            yearInput.focus();
          }
        } catch (ex) {
          console.log("ex : ", ex );
        }
      }
      //toggle year dropdown
      scope.toggleYearDropdownFn = function() {
        scope.droppedYear = !scope.droppedYear;
        if(scope.droppedYear) {
          yearInputFocus();
        }
      }

      //hide year dropdown
      scope.hideYearDropDownFn = function() {
        $timeout(function() {
          if(blur){
            scope.droppedYear = false;
          }
          blur = true;
        },100);
      }

      //select year
      scope.selectYearFn = function(year) {
        scope.selectedYear = year;
        scope.droppedYear = false;
        updateDate();
      }

      //next set of years
      scope.nextYears = function(){
        blur = false;
        if(scope.maxYear+5 < scope.endYear){
          scope.maxYear = scope.maxYear+5;
          scope.minYear = scope.minYear+5;
        }
        else{
          var diff =  scope.endYear - scope.maxYear;
          scope.maxYear = scope.maxYear+diff;
          scope.minYear = scope.minYear+diff;
        }
        yearInputFocus();
      }

      //pervious set of years
      scope.previousYears = function(){
        blur = false;
        if(scope.minYear-5 > scope.startYear){
          scope.maxYear = scope.maxYear-5;
          scope.minYear = scope.minYear-5;
        }
        else{
          var diff =  scope.minYear - scope.startYear;
          scope.maxYear = scope.maxYear-diff;
          scope.minYear = scope.minYear-diff;
        }
        yearInputFocus();
      }

      // ************************** month ****************************

      //initialize months
      scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      var monthInputFocus = function(){
        try {
          if(monthInput == undefined) {
              monthInput = element[0].children[1].children[0].children[0];
          }
          if(monthInput.tagName == "INPUT") {
            monthInput.focus();
          }
        } catch (ex) {
          console.log("ex : ", ex );
        }
      }

      //set month
      scope.selectMonthFn = function(month) {
        scope.selectedMonth = month;
        scope.droppedMonth = false;
        updateDays();
        updateDate();
      }

      //toggle month dropdown
      scope.toggleMonthDropdownFn = function() {
        scope.droppedMonth = !scope.droppedMonth;
        if(scope.droppedMonth) {
          monthInputFocus();
        }
      }

      //hide month dropdown
      scope.hideMonthDropDownFn = function() {
        $timeout(function() {
          scope.droppedMonth = false;
        },100);
      }

      // ************************** day ****************************
      var dayInputFocus = function(){
        try {
          if(dayInput == undefined) {
              dayInput = element[0].children[2].children[0].children[0];
          }
          if(dayInput.tagName == "INPUT") {
            dayInput.focus();
          }
        } catch (ex) {
          console.log("ex : ", ex );
        }
      }

      var updateDays = function () {
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

      //select day
      scope.selectDayFn = function(day) {
        scope.selectedDay = day;
        scope.droppedDay = false;
        updateDate();
      }

      //toggle month dropdown
      scope.toggleDayDropdownFn = function() {
        scope.droppedDay = !scope.droppedDay;
        if(scope.droppedDay) {
          dayInputFocus();
        }
      }

      //hide month dropdown
      scope.hideDayDropDownFn = function() {
        $timeout(function() {
          scope.droppedDay = false;
        },100);
      }


      // ************************** render ************************
      ngModel.$render = function() {
        if (ngModel.$viewValue != undefined) {
          scope.selectedDay = ngModel.$viewValue.getDate();
          scope.selectedMonth = scope.months[ngModel.$viewValue.getMonth()];
          scope.selectedYear = ngModel.$viewValue.getFullYear();
        }
      }


      // ************************** update date ************************
      var updateDate = function() {
        if (scope.selectedYear && scope.selectedMonth && scope.selectedDay) {
          var tempDate = scope.selectedDay + " " + scope.selectedMonth + " " + scope.selectedYear;
          ngModel.$setViewValue(new Date(tempDate));
        }
      }

    }
  }
}]);









myApp.directive('customSelect', ['$timeout',function($timeout) {
  return {
    require: 'ngModel',
    replace: true,
    scope: {
      options: "=",
      placeHolder: "@"
    },
    templateUrl: "partials/selectTemplate.html",
    compile: function(element, attrs){
      try {

        //calculate the width of the input and the options
        var selectWidth = element[0].children[0].offsetWidth;
        var buttonWidth = element[0].children[0].children[1].offsetWidth;
        var input = angular.element(element[0].children[0].children[0]);
        var options = angular.element(element[0].children[1]);
        var width = Number(selectWidth) - Number(buttonWidth);
        input.css('width', width+'px');
        options.css('width', width+'px');
      } catch (ex) {
        console.log("ex : ", ex );
      }

      /********************* return the link function *********************/
      return function(scope, element, attrs, ngModel) {

        //initialize variables
        var input = undefined;
        scope.showOption = false;
        scope.filteredOptions = [];

        scope.selectOptionFn = function(option) {
          //select event function
          ngModel.$setViewValue(option);
          scope.selectedOption = option;
        }

        //hide options
        scope.toggleOptionsFn = function() {
          //toggle the option list
          scope.showOptions = !scope.showOptions;
          //set focus to the input tage
          if (scope.showOptions) {
            try {
              if(input == undefined) {
                  input = element[0].children[0].children[0];
              }
              if(input.tagName == "INPUT") {
                input.focus();
              }
            } catch (ex) {
              console.log("ex : ", ex );
            }
          }
        }

        //hide options
        scope.hideOptionsFn = function() {
          $timeout(function() {
            scope.showOptions = false;
          },100);
        }


        //filter the select options
        scope.filterOptionsFn = function() {
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

        // ************************** render ************************
        ngModel.$render = function() {
          scope.selectedOption = ngModel.$viewValue;
        }

        // ************************* watch options **********************
        scope.$watch('options', function(newVal){
          scope.filteredOptions = scope.options;
        });

      }

    }
  }
}]);

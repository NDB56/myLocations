// app.js
var App = angular.module('myLocationsApp', ["ui.router", "ngTouch", "LocalStorageModule", "angular.filter", "ngMap", "angular-vibrator"]);

App.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'home.html'
        })

        // nested list with custom controller
        .state('categories', {
            url: '/categories',
            templateUrl: 'categories.html',
            controller: function ($scope, localStorageService) {
                if (!(localStorageService.get("categories"))) {
                    $scope.categories = [{ name: 'Category1' }, { name: 'Category2' }, { name: 'Category3' }];
                }
                else {
                    $scope.categories = localStorageService.get("categories");
                }
            }
        })

        .state('locations', {
            url: '/locations',
            templateUrl: 'locations.html',
            controller: function ($scope, localStorageService) {
                if (!(localStorageService.get("categories"))) {
                    $scope.categories = [{ name: 'Category1' }, { name: 'Category2' }, { name: 'Category3' }];
                }
                else {
                    $scope.categories = localStorageService.get("categories");
                }
                if (!(localStorageService.get("locations"))) {
                    $scope.locations = [{ Name: "Snif Raanana", Address: "Eliezer Yafe 1", Coordinates: "32.180572, 34.874744", Category: { name: 'Category1' } },
                   { Name: "Snif Ramat Hasharon", Address: "Sokolov 72", Coordinates: "32.146250, 34.838771", Category: { name: 'Category2' } }];
                }
                else {
                    $scope.locations = localStorageService.get("locations");
                }
            }
        })
});

App.controller("LocationsCtrl", ['$scope', 'vibrator', function ($scope, localStorageService) 
{
    $scope.isInAddLocationMode = false;
    $scope.isInEditLocationMode = false;
    $scope.groupByCategory = false;

    $scope.map = { center: { latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
    $scope.options = { scrollwheel: false };

    $scope.addLocation = function () {
        $scope.isInEditLocationMode = false;
        $scope.isInAddLocationMode = true;
        $scope.newLocation = { Name: "", Address: "", Category: null, Coordinates: "" };
    }

    $scope.insertLocation = function () {
        var newLocation = $scope.newLocation;
        $scope.locations.push(newLocation);
        $scope.isInAddLocationMode = false;
    };

    $scope.editLocation = function () {
        $scope.isInAddLocationMode = false;

        if ($scope.selectedLocation) {
            $scope.editLocation = angular.copy($scope.selectedLocation);
            $scope.isInEditLocationMode = true;
        }
    }

    $scope.updateLocation = function () {
        $scope.selectedLocation.Name = angular.copy($scope.editLocation.Name);
        $scope.selectedLocation.Address = angular.copy($scope.editLocation.Address);
        $scope.selectedLocation.Category = angular.copy($scope.editLocation.Category);
        $scope.selectedLocation.Coordinates = angular.copy($scope.editLocation.Coordinates);
        $scope.editLocation = null;
        $scope.isInEditLocationMode = false;
    }

    $scope.selectLocation = function (Location) {
        $scope.isInEditLocationMode = false;
        $scope.isInAddLocationMode = false;
        $scope.selectedLocation = Location;
        navigator.vibrate(1000);
    };

    $scope.isLocationSelected = function (Location) {
        return $scope.selectedLocation === Location;
    }

    $scope.deleteLocation = function () {
        if ($scope.selectedLocation) {
            var index = $scope.locations.indexOf($scope.selectedLocation);
            $scope.locations.splice(index, 1);
            $scope.selectedLocation = null;
            $scope.isInEditLocationMode = false;
            $scope.isInAddLocationMode = false;
        }
    };

    $scope.setGrouping = function () {
        $scope.groupByCategory = ($scope.groupByCategory ? false : true);
    }

    $scope.shareLocations = function ()
    {

        alert(angular.toJson($scope.locations, true));
    };
    //Every change in locations will be sved to local storage.
    $scope.$watch("locations", function (newVal, oldVal) {
        if (newVal !== null && angular.isDefined(newVal) && newVal !== oldVal) {
            localStorageService.add("locations", angular.toJson(newVal));
        }
    }, true);
}]);


App.controller("CategoriesCtrl", function ($scope, localStorageService) {
    $scope.isInAddCategoryMode = false;
    $scope.selectedCategoryName = "";

    $scope.addCategory = function () {
        $scope.isInEditCategoryMode = false;
        $scope.isInAddCategoryMode = true;
    }

    $scope.insertCategory = function () {
        var newCategory = { name: $scope.newCategoryName }
        $scope.categories.push(newCategory);
        $scope.newCategoryName = null;//Reset the text field.
        $scope.isInAddCategoryMode = false;
    };

    $scope.editCategory = function () {
        $scope.isInAddCategoryMode = false;
        if ($scope.selectedCategory) {
            $scope.selectedCategoryName = $scope.selectedCategory.name;
            $scope.isInEditCategoryMode = true;
        }
    }

    $scope.updateCategory = function () {
        $scope.isInEditCategoryMode = false;
        $scope.selectedCategory.name = $scope.selectedCategoryName;
        //$scope.selectedCategory = $scope
        //var index = $scope.categories.indexOf($scope.selectedCategory)
        //$scope.categories[index] = $scope.selectedCategory;
    }

    $scope.selectCategory = function (category) {
        $scope.isInEditCategoryMode = false;
        $scope.isInAddCategoryMode = false;
        $scope.selectedCategory = category;
    };

    $scope.isCategorySelected = function (category) {
        return $scope.selectedCategory === category;
    }

    $scope.deleteCategory = function () {
        if ($scope.selectedCategory) {
            var index = $scope.categories.indexOf($scope.selectedCategory);
            $scope.categories.splice(index, 1);
            $scope.selectedCategory = null;
            $scope.isInEditCategoryMode = false;
            $scope.isInAddCategoryMode = false;
        }
    };

    $scope.shareCategories = function ()
    {
        
        alert(angular.toJson($scope.categories, true));
    };

    //Every change in categories will be sved to local storage.
    $scope.$watch("categories", function (newVal, oldVal) {
        if (newVal !== null && angular.isDefined(newVal) && newVal !== oldVal) {
            localStorageService.add("categories", angular.toJson(newVal));
        }
    }, true);
});


App.directive('showFocus', function ($timeout)
{
    return function (scope, element, attrs)
    {
        scope.$watch(attrs.showFocus,
          function (newValue)
          {
              $timeout(function ()
              {
                  newValue && element.focus();
              });
          }, true);
    };
});


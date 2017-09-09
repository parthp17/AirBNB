/**
 * Created by Nilam on 11/14/2016.
 */
//loading the `map_search` angularJS module
var map_search = angular.module('gmapSearch', ['ui.router', 'gmapService', 'rzModule']);
map_search.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('gmapSearch', {
        url: '/map',
        views: {
            'navbar': {
                templateUrl: 'templates/user.html'
            },
            'content': {
                templateUrl: 'templates/gmap_search.html'
            }
        }
    });
    $urlRouterProvider.otherwise('/');
});

//defining the `map_search` controller
map_search.controller('gmapSearchCtrl', function ($scope, $window, $http, gmapService) {

    // $scope.categories = ['Home', 'Villa', 'Apartment', 'Castle'];

    // $scope.selection = ['Home', 'Villa', 'Apartment', 'Castle'];
    $scope.home = "home";
    $scope.apartment = "apartment";
    $scope.villa = "villa";
    $scope.castle = "castle";

    $scope.toggleSelection = function toggleSelection(category) {
        var idx = $scope.selection.indexOf(category);

        // is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.selection.push(category);
        }
        alert($scope.selection);
    };

    $scope.slider = {
        minValue: 10,
        maxValue: 10000,
        options: {
            floor: 10,
            ceil: 10000,
            step: 1,
        }
    };

    $scope.$on("slideEnded", function () {
        // user finished sliding a handle
        alert($scope.slider.minValue);
        alert($scope.slider.maxValue);
        $scope.applyFilters();
    });

    $scope.screenHeight = $window.innerHeight;

    // Set initial coordinates to the center of the US
    var defaultLat = 39.500;
    var defaultLong = -98.350;

    $scope.gmapSearchInit = function () {

        $http({
            method: 'POST',
            url: '/gmapSearch',

        }).success(function mysucess(response) {

            if (response.statusCode == 200) {
                $scope.records = response.listing;
                $scope.checkout = response.checkout;
                $scope.guests = response.guests;
                $scope.where = response.where;

                defaultLat = response.whereLat;
                defaultLong = response.whereLng;
                gmapService.refresh(defaultLat, defaultLong, $scope.records);
            } else {
                gmapService.refresh(defaultLat, defaultLong, []);
            }
        }).error(function myerror(err) {
            console.log("err" + err);
        });
    }

    $scope.applyFilters = function () {

        // alert($scope.where);
        // alert($scope.villa);
        // alert($scope.apartment);
        // alert($scope.castle);
        // alert($scope.checkin);
        // alert($scope.checkout);
        // alert($scope.guests);

        $http({
            method: 'POST',
            url: '/filter',
            data: {
                where: $scope.where,
                checkin: $scope.checkin,
                checkout: $scope.checkout,
                guests: $scope.guests,
                home: $scope.home,
                apartment: $scope.apartment,
                villa: $scope.villa,
                castle: $scope.castle,
                minValue: $scope.slider.minValue,
                maxValue: $scope.slider.maxValue
            }

        }).success(function mysucess(response) {

            if (response.statusCode == 200) {
                // var result = response.title;
                // console.log(user);
                // alert(response.results);
                $scope.records = response.results;
                console.log($scope.record);
                console.log("filter success");
                // alert(response.results[0].title);
                // $state.go('gmapSearch', {myParam: {some: 'thing'}})
                // window.location.assign("/map");

            }
            else if (response.statusCode == 300) {
                $scope.records = [];
                console.log("nothing filter");
            }
            else {
                console.log("filter not success");
                window.alert("filter not success");
                // window.location.assign("/homepage");
            }
        }).error(function myerror(err) {
            console.log("err" + err);
        });
    }

    $scope.productType = function (id,price) {

        alert(id);

        $http({
            method: 'POST',
            url: '/displayProperty',
            data: {
                "property_id": id,
                "property_price": price,
            }

        }).success(function mysucess(response) {

            if (response.statusCode == 200) {
                window.location.assign("/displayProperties");
            } else {
                // gmapService.refresh(defaultLat, defaultLong, []);
            }
        }).error(function myerror(err) {
            console.log("err" + err);
        });
    }


});


map_search.directive('setHeight', function ($window) {
    return {
        link: function (scope, element) {
            element.css('height', $window.innerHeight + 'px');
        }
    }
});

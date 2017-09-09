var home = angular.module('home', ['ui.router']);
home.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('home', {
        url : '/',
        views: {
            'nonuser': {
                templateUrl : 'templates/nonuser.html',
            },
            'user':{
               templateUrl : 'templates/user.html',
            },
            'home_content':{
                templateUrl : 'templates/home_content.html',
            },

        }
    })
    $urlRouterProvider.otherwise('/');
});

home.controller('homecontroller',function($scope,$http){

    console.log("inside homecontroller");


    $scope.value1=false;
    $scope.value2=true;

    $http({
        method:'get',
        url:'/requser'
    }).success(function mysuccess(response){

        console.log(response);
        if(response.code==200) {
            var user = response.user;
            if (user != undefined && user != "guest") {
                $scope.value1 = true;
                $scope.value2 = false;
                $scope.user=user;
            }
        }

    }).error(function myerror(error){

        console.log("error at homecontroller");
    });




});


home.controller('signup',function($scope,$http){

    //debugger
    console.log("inside controller of signup");
    $scope.alreadypresent=true;

   $scope.submit=function () {

       var fname=$scope.fname;
       console.log(fname);

       if(fname.length>0) {
           $http({
               method: 'post',
               url: '/registeruser',
               data: {
                   firstname: $scope.fname,
                   lastname: $scope.lname,
                   email: $scope.email,
                   password: $scope.password
               }
           }).success(function mysuccess(response) {
               console.log(response);

               if (response.statusCode == 200) {
                   console.log("user added successfully");
                   window.alert("user added successfullly");
                   window.location.assign("/homepage");

               }
               else if(response.statusCode == 400) {
                   console.log("user already present");
                  $scope.alreadypresent=false;
                   //window.location.assign("/homepage");
               }
               else
               {
                   window.alert("some error!!!");
                   window.location.assign("/homepage");
               }
           }).error(function (err) {
               console.log("err:" + err);
           });

           //window.alert("hi");

       }
    }
});

home.controller('signin',function($scope,$http){

    console.log("inside the controller of signin");
    $scope.failedlogin=true;

    $scope.signin_submit=function(){

        $http({
            method:'POST',
            url:'/signin',
            data:{
                username:$scope.username,
                password:$scope.password
            }
        }).success(function mysucess(response){

            console.log(response);

            if(response.statusCode==200)
            {
                user=response.user;
                console.log(user);
                console.log("signin success");
                window.alert("User authenticated: "+user);
                window.location.assign("/homepage");

            }
            else
            {
                console.log("signin not success");
                $scope.failedlogin=false;
                //window.alert("Sorry You are not authenticated");

                //window.location.assign("/homepage");
            }
        }).error(function myerror(err){
            console.log("err"+err);

        });
    }

});


home.controller('userdropdown',function($scope,$http){

    console.log("inside userdropdown in homepage.js");

    $scope.editprofile=function () {

        //var clickitem=$scope.clickitem1;
        //console.log(clickitem);

        window.location.href="userwindow";

    };

   /* $scope.userprofile=function(){

        var clickitem=$scope.clickitem2;
        console.log(clickitem);
        window.location.href="userwindow/"+clickitem;
    }*/

    $scope.logout=function () {
        console.log("logout");

        $http({
            method:'post',
            url:'/logout'
        }).success(function mysuccess(response) {
            if(response.statusCode==200) {
                console.log("logout success");
                window.location.assign("/homepage");
            }
        })

    }

});


home.controller('hostdropdown',function ($scope,$http) {

    console.log("inside host dropdown");


    $scope.createlisting=function()
    {
        window.location.href="createlisting";
    };

    $scope.editprofile=function () {

        //var clickitem=$scope.clickitem1;
        //console.log(clickitem);

        window.location.href="userwindow";

    };


});

home.controller('kemy_homepage', function ($scope, $http, $window) {

    console.log("inside search in kemy homepage");

    $scope.getAllProperties = function () {
        alert("inside getAllProperties");

        $http({
            method: 'POST',
            url: '/getAllProperties',
            // data:{
            //     where:$scope.where,
            //     checkin:'2016-11-21',
            //     checkout:'2016-12-21',
            //     guests:$scope.guests
            //     // checkin:$scope.checkin,
            //     // checkout:$scope.checkout
            // }
        }).success(function myproperties(response) {
            debugger
            console.log(response);

            if (response.statusCode == 200) {
                // var result=response.title;
                // console.log(user);
                alert(response.results[0].image);
                $scope.record = response.results;
                console.log($scope.record);
                alert("getAllProperties success");
                // window.alert(response.results[0].title);
                // $state.go('gmapSearch', {myParam: {some: 'thing'}})
                // window.location.assign("/map");

            }
            else {
                console.log("search not success");
                window.alert("search not success");
                // window.location.assign("/homepage");
            }
        }).error(function mypropertieserror(err) {
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
                gmapService.refresh(defaultLat, defaultLong, []);
            }
        }).error(function myerror(err) {
            console.log("err" + err);
        });
    }

    $scope.search = function () {
        console.log("inside search");
        console.log($scope.where);
        console.log($scope.checkin);
        console.log($scope.checkout);
        console.log($scope.guests);
        $http({
            method: 'POST',
            url: '/search',
            data: {
                where: $scope.where,
                checkin: '2016-01-03',
                checkout: '2016-01-06',
                guests: $scope.guests
                // checkin:$scope.checkin,
                // checkout:$scope.checkout
            }
        }).success(function mysucess(response) {
            debugger
            console.log(response);

            if (response.statusCode == 200) {
                var result = response.title;
                // console.log(user);
                console.log("search success");
                // alert(response.results[0].title);
                // $state.go('gmapSearch', {myParam: {some: 'thing'}})
                window.location.assign("/map");

            }
            else {
                console.log("search not success");
                window.alert("search not success");
                // window.location.assign("/homepage");
            }
        }).error(function myerror(err) {
            console.log("err" + err);

        });

    }
});
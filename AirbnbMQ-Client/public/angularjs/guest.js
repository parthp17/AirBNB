var app=angular.module('guestModule',['ui.router','ngMaterial']);

app.controller('propertyController',function ($scope,$http,$window) {

    $scope.loadproperty=function(){

        $scope.bid_section = false;
        $scope.buy_section = false;
        alert("in loadproperty");
        $http({
            method:"POST",
            url:'/propertydetails',

        }).success(function (data) {
            alert("in success function");
            if(data.statusCode==200){
                alert(data.property[0].is_bidding);
                if(data.property[0].is_bidding) {
                    alert("in if");
                    alert(data.bid[0].bid_price);
                    alert(data.reviews);
                    $scope.highest = data.bid[0].bid_price;
                    $scope.bids = data.bid;
                    $scope.reviews = data.reviews;
                    $scope.bid_section = true;
                    $scope.buy_section= false;
                }
                else {
                    alert("in else");
                    alert(data.reviews);
                    $scope.reviews = data.reviews;
                    $scope.buy_section= true;
                    $scope.bid_section = false;
                }
                $scope.random1=data.property[0].capacity;
                $scope.random2=data.property[0].category_name;
                $scope.random=data.property[0].bedrooms;
            }
            else{
                alert("Enter number lesser than " );
            }
        })
    }


    $scope.applychanges = function () {

        $http({
            method: 'POST',
            url: '/changes',
            data: {

                checkin: $scope.checkin,
                checkout: $scope.checkout,
                guests: $scope.guests
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
            else {
                console.log("filter not success");
                window.alert("filter not success");
                // window.location.assign("/homepage");
            }
        }).error(function myerror(err) {
            console.log("err" + err);
        });
    }


    $scope.check=function(){
        var number = $scope.guests;
        $http({
            method:"POST",
            url:'/verifynumber',
            data : {
                "number": number,
            }
        }).success(function (data) {
            alert("in success function");
            if(data.result=="success"){
                $scope.valid_num=false;
                $scope.guests = number;
            }
            else{
                $scope.valid_num=true;
                alert("Enter number lesser than " + (data.valid_num+1) );
            }
        })
    }

    $scope.checkrent=function(){
        var stay = 2;
        $http({
            method:"POST",
            url:'/totalrent',
            data : {
                "checkout": $scope.checkout,
                "checkin": $scope.checkin,
                "stay": stay,
            }
        }).success(function (data) {
            alert("in success function");
            if(data.result=="success"){
                $scope.total = data.price*$scope.checkout;

            }
            else{
                $scope.valid_num=true;
                alert("error occurred");
            }
        })
    }

    $scope.request=function(){
        alert($scope.checkin);
        $http({
            method:"POST",
            url:'/change',
            data : {
                "checkin": $scope.checkin,
                "checkout": $scope.checkout,
                "guests": $scope.guests,

            }
        }).success(function (data) {
            alert("in success function");
            if(data.statusCode==200){
                window.location.assign("/payment");
            }
            else{
                // $scope.valid_num=true;
                alert("This dates are not available");
            }
        })
    }

    $scope.make_bid=function(){
        alert($scope.bid);

        $http({
            method:"POST",
            url:'/make_bid',
            data : {
                "bid": $scope.bid,
            }
        }).success(function (data) {
            alert("in success function");
            if(data.statusCode==200){
                // $scope.total = data.price*$scope.checkout;
                alert(data.result);
                alert("bid placed");
            }
            else{
                // $scope.valid_num=true;
                alert("error occurred");
            }
        })
    }

    $scope.submit=function(){
        alert("hello");
        var stay = 2;
        $http({
            method:"POST",
            url:'/details',
            data : {
                "month": $scope.month,
                "year": $scope.year,
                "number": $scope.number,
                "cvv": $scope.cvv,
            }
        }).success(function (data) {
            alert("in success function");
            if(data.statusCode=200){
                window.location.assign("/homepage");

            }
            else{
                $scope.valid_num=true;
                alert("error occurred");
            }
        })
    }

    $scope.add=function(){

        alert($scope.month);
        alert($scope.year);
        alert($scope.number);
        alert($scope.cvv);

        $http({
            method:"POST",
            url:'/add_details',
            data : {
                "month": $scope.month,
                "year": $scope.year,
                "number": $scope.number,
                "cvv": $scope.cvv,
            }
        }).success(function (data) {
            if(data.statusCode==200){
                window.location.assign("/display_property");

            }
            else{
                // $scope.valid_num=true;
                alert("error occurred");
            }
        })
    }


    $scope.load=function(){

        alert("in load details");
        $http({
            method:"POST",
            url:'/load_details'
        }).success(function (data) {
            if(data.statusCode==200){
                $scope.name = data.result[0].fname + " " +data.result[0].lname;
                $scope.month = data.result[0].month;
                $scope.year = data.result[0].year;
                $scope.number = data.result[0].card;

            }
            else{
                // $scope.valid_num=true;
                alert("error occurred");
            }
        })
    }


});
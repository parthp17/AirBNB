
var userwindow = angular.module('userwindow', ['ui.router','ngFileUpload']);


userwindow.config(function ($stateProvider,$urlRouterProvider) {
    //state based ui-sref
    //$urlRouterProvider.otherwise('/');
    console.log("inside userwindow");
    $stateProvider.state('account',{
        //url:'/',
        templateUrl: '../templates/account.html',
        controller:'getaccount'
    })
        .state('profile',{
            templateUrl: '../templates/profile.html',
            controller:'profilecontroller'
        })

        .state('dashboard',{
            templateUrl:'../templates/dashboard.html',
            controller:'dashboardcontroller'
        })

        .state('billing',{
            templateUrl:'../templates/billing.html',
            controller:'billingcontroller'
        })
        . state('listing',{
            templateUrl:'../templates/urlisting.html',
            controller:'listingcontroller'
        })
        .state('stats',{
            templateUrl:'../templates/stats.html',
            controller:'HostStatsController'
        });




});




userwindow.controller('profile',function($scope,$http){

    console.log("inside profile in userwindow.js");

    $http({
        method:'get',
        url:'/requser'
    }).success(function mysuccess(response){

        console.log(response);
        if(response.code==200) {
            var user = response.user;
            if (user != undefined && user != "guest") {
               $scope.user=user;
            }
        }

    }).error(function myerror(error){

        console.log("error at homecontroller");
    });

    $scope.logout=function() {
        console.log("logout");
        $http({
            method: 'post',
            url: '/logout'
        }).success(function mysuccess(response) {
            if (response.statusCode == 200) {
                console.log("logout success");
                window.location.assign("/homepage");
            }
        });
    }


    $scope.homepage=function()
    {
        window.location.assign("/homepage");
    };

    $scope.createlisting=function()
    {
        window.location.href="createlisting";
    }

});

userwindow.controller('profilecontroller',['$scope','$http','Upload',function($scope,$http,Upload){

    console.log("inside profile controller--to get user profile and update");

    $scope.nameerror=true;
    $scope.moberror=true;

    var fname,lname,emailid;
    $scope.defaultprofile=false;
    $scope.vprofile=true;

    $http({
        method:'get',
        url:'/profile'
    }).success(function mysuccess(response){
        console.log("profile controller :"+response.data[0]);
        console.log(response.data[0]);

        console.log(response.data[0].fname);
        fname=response.data[0].fname;
        $scope.fname=fname;
        //console.log($scope.data[0].fname);
        lname=response.data[0].lname;
        $scope.lname=lname;
        emailid=response.data[0].email;
        $scope.emailid=emailid;
        $scope.line1=response.data[0].address_line1;
        $scope.line2=response.data[0].address_liine2;
        $scope.city=response.data[0].city;
        $scope.state=response.data[0].state;
        $scope.country=response.data[0].country;
        $scope.zipcode=response.data[0].zipcode;
        $scope.mobnum=response.data[0].phone_number;


    }).error(function myerror(err){
        console.log(err);
    });


    $scope.updateuser=function(){

        console.log("inside the update user function");

        var user=$scope.fname;
        console.log(user);

        var mum=$scope.mobnum;
        var count=mum.toString().length
        console.log(count);

        if($scope.fname!=undefined && count==10 )
        {

            console.log("password match");
            var data={
                firstname:$scope.fname,
                    lastname:$scope.lname,

                    email:$scope.emailid,
                    line1:$scope.line1,
                    line2:$scope.line2,
                    city:$scope.city,
                    state:$scope.state,
                    country:$scope.country,
                    zipcode:$scope.zipcode,
                    mobnum:$scope.mobnum,
                files:$scope.image

            };
            console.log(data);
            Upload.upload({

                url:'/updateprofile',
                data:data
            }).then(function(response){
                console.log(response);
                if(response.data.statusCode==200){
                    window.alert("user info updated..please login again with update creditentials");
                    window.location.href="userwindow";


                }

            },function(err){
                console.log(err);
            });
        }
        else
        {

            if(count==10)
            {
                $scope.nameerror=false;
                console.log("First Name  is mandatory");
            }
            else if($scope.fname!=undefined)
            {
                $scope.moberror=false;
                console.log("Mobile number needs to 10");
            }
            else
            {
                $scope.moberror=false;
                $scope.nameerror=false;
            }

        }
    }

    $scope.viewprofile=function(){

        console.log("inside view profile");

        $scope.defaultprofile=true;
        $scope.vprofile=false;
        console.log($scope.vprofile);
        $scope.hostsection=true;
        $scope.hostsection1=false;
        $scope.hostsection2=true;

        $scope.usersection=true;
        $scope.usersection1=false;
        $scope.hostsection2=true;

        $scope.fname=fname;
        $scope.lname=lname;
        $scope.emailid=emailid;


        $http({
            method:'get',
            url:'/getreviews'
        }).success(function mysuccess(response){
            console.log("response"+response);
             console.log(response);
            $scope.image = response.image;
            if(response.reviewsByHost!=false)
            {
                console.log("1");
                $scope.hostreview=response.reviewsByHost;
                $scope.hostsection1=true;
                $scope.hostsection2=false;


            }
            if(response.reviewsByUser!=false)
            {
                console.log("2");
                $scope.userreview=response.reviewsByUser;
                $scope.usersection1=true;
                $scope.usersection2=false;
            }


        }).error(function myerror(err){
            console.log(err);
        });

        $scope.hostshow=function()
        {
                $scope.hostsection=false;
            $scope.usersection=true;
        }

        $scope.guestshow=function()
        {
            $scope.hostsection=true;
                $scope.usersection=false;
        }




    };


}]);


userwindow.controller('getaccount',function ($scope,$http) {

    console.log("inside getaccount");

    $scope.hostrequest=false;
    $scope.hostrequest=false;
    $scope.passwordform=true;

    $http({
      method:'get',
        url:'/myaccount'
     }).success(function mysuccess(response){
           console.log("response"+response.hostid);
           if(response.host){
               $scope.userid=response.userid;
               $scope.fname=response.fname;
               $scope.lname=response.lname;
               $scope.hostid=response.hostid;
               $scope.host=false;
               $scope.hostbutton=false;
               $scope.hostrequest=true;
               $scope.hostrequest=true;
           }
           else{

               $scope.userid=response.userid;
               $scope.fname=response.fname;
               $scope.lname=response.lname;
           }


    }).error(function myerror(err){
        console.log("err"+err);
    });



    $scope.deleteuser=function(){

        console.log("inside delete user");
        $http({
            method:'get',
            url:'/deleteuser'
        }).success(function mysuccess(response){
            console.log("my response :"+response);
            if(response.statusCode==200){
                window.alert("user deleted");
                $http({
                    method:'post',
                    url:'/logout'
                }).success(function mysuccess(response) {
                    if(response.statusCode==200) {
                        console.log("logout success");
                        window.location.assign("/homepage");
                    }
                });

            }
        }).error(function myerror(err){
            console.log("error"+err);
        });


    };

    $scope.deletehost=function(){

        console.log("inside delete host");

        $http({
            method:'get',
            url:'/deletehost'
        }).success(function mysuccess(response){
            console.log("my response :"+response);
            if(response.statusCode==200){
                window.alert("host deleted");
                window.location.href="userwindow";
             }
        }).error(function myerror(err){
            console.log("error"+err);
        });



    };


    $scope.requesthost=function()
    {
        console.log("inside request host");


        $http({
            method:'get',
            url:'/adminrequest'
        }).success(function mysuccess(response){
            console.log(response);
            if(response.statusCode==200)
            {
                window.alert("request sent successfully");

            }
            else
            {
                window.alert("Some error occured");

            }
        }).error(function myerror(err){
            console.log("err"+err);
        });
    }

    $scope.reqpcform=function()
    {
        $scope.passwordform=false;
    }

    $scope.passwordchange=function()
    {
        console.log("inside change password:"+$scope.password);

        $http({
            method:'post',
            url:'/changepassword',
            data:{
                password:$scope.password
            }

        }).success(function mysuccess(response){
            if(response.statusCode==200)
            {
                window.alert("password change successful");

                $http({
                    method:'post',
                    url:'/logout'
                }).success(function mysuccess(response) {
                    console.log(response);
                    if(response.statusCode==200) {
                        console.log("logout success");
                        window.location.assign("/homepage");
                    }
                });
            }
        }).error(function myerror(err){
             console.log("err"+err);
        });

    }


});

userwindow.controller('dashboardcontroller',function($scope,$http){

    console.log("inside dashboardcontroller");

    $scope.nolist=true;
    $scope.nolistmsg=false;

    $scope.noapproval=true;
    $scope.noappmsg=false;

    $http({
        method:'get',
        url:'/getdashboard'
    }).success(function mysuccess(response){
         console.log(response);
         console.log("statusCode:"+response.statusCode);

        if(response.statusCode==200)
        {
            //console.log("listing:"+response.list[0].fname);
            console.log(response.list);
            console.log(response.approvals);
            console.log(response.list.length);
           if(response.list.length>0)   //list of items to be approved is more than zero
           {
               $scope.nolist=false;             //display list
               $scope.nolistmsg=true;           //no empty msg
               if(response.approvals)           //if approvals present
               {
                   $scope.noapproval=false;         //display approval table
                   $scope.noappmsg=true;            //hide no approvals msg
               }

               $scope.list=response.list;               //put to list of approvals
               $scope.approvals=response.approvals;     //assign the appoved items---it will be not be displayed
                                                        //in case no items present
           }
           else if(response.approvals)              //if no items to be approved and only approval list to be shown
           {
               $scope.noapproval=false;
               $scope.noappmsg=true;
               $scope.approvals=response.approvals;
           }
           else
           {
               console.log("nothing to be displayed");
           }

            console.log("items there to be displayed");
        }
        else
        {
            console.log("no items to be displayed");
        }

        //$scope.list=response.list;
    }).error(function myerror(err){
        console.log(err);
    });


    $scope.approve=function(bid,uid,tp,pid,sd,ed)
    {
        console.log("inside approve function");
        console.log("ids:bid:"+bid,uid,tp,pid,sd,ed);

        $http({
            method:'post',
            url:'/hostapprove',
            data:
            {
                bid:bid,
                uid:uid,
                tp:tp,
                pid:pid,
                sd:sd,
                ed:ed

            }
        }).success(function mysuccess(response){
            console.log("success"+response);
            window.location.reload(false);


        }).error(function myerror(err){
            console.log("err"+err);
        });
    };

    $scope.reject=function(bid){

        console.log("inside reject function");

        console.log("ids:bid:"+bid);

        $http({
            method:'post',
            url:'/hostdisapprove',
            data:
            {
                bid:bid

            }
        }).success(function mysuccess(response){
            console.log("success"+response);
            window.location.reload();
        }).error(function myerror(err){
            console.log("err"+err);
        });

    };


    $scope.hidereq=function(booking_id)
    {
        console.log("inside hide");
        console.log(booking_id);


        $http({
            method:'post',
            url:'/hide',
            data:{
                booking_id:booking_id
            }
        }).success(function mysuccess(response){
                console.log("inside my success");
                console.log(response);
                console.log(response.statusCode);
            //response
            if(response.statusCode==200)
            {
                console.log("inside status code 200");
                //console.log("listing:"+response.list[0].fname);
                console.log(response.list);
                console.log(response.approvals);
                console.log(response.list.length);
                if(response.list.length>0)
                {
                    //seeing if there are items for approval

                    $scope.nolist=false;
                    $scope.nolistmsg=true;
                    //if there are approved items
                    if(response.approvals)
                    {
                        $scope.noapproval=false;
                        $scope.noappmsg=true;
                    }

                    $scope.list=response.list;
                    $scope.approvals=response.approvals;
                }
                else if(response.approvals)    //if there is approved items and no listing
                {
                    $scope.noapproval=false;
                    $scope.noappmsg=true;
                    $scope.approvals=response.approvals;
                }
                else
                {
                    console.log("nothing to be displayed");

                    window.location.assign("/userwindow");

                }

                console.log("items there to be displayed");
            }
            else
            {
                console.log("some error");
            }



                //error function
        }).error(function myerror(err){
            console.log(err);
        });


    }


    $scope.editreq=function(booking_id)
    {
        //window.location.href = "editlisting?pid=" + property_id;


        $http({
            method: 'POST',
            url: '/displayProperty',
            data: {
                "property_id": id
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

});


userwindow.controller('billingcontroller',['$scope','$http','Upload',function($scope,$http,Upload){


    $scope.submithost=true;
    $scope.submituser=false;
    $scope.propertyreview=true;

    console.log("inside billing controller");

    $scope.usertrip=true;
    $scope.userrevenue=true;

    $scope.notrip=false;
    $scope.norevenue=false;

    $http({
        method:'get',
        url:'/fetchbills'
    }).success(function mysuccess(response){
          console.log(response);

        if(response.count1)
        {
           $scope.usertrip=false;
            $scope.notrip=true;
        }
        if(response.count2)
        {
            $scope.userrevenue=false;
            $scope.norevenue=true;
        }
        if(response.revenue)
        {

            $scope.revenue=response.revenue;
            $scope.trips=response.trips;
        }

        else
        {
            //no revenue part
            $scope.trips=response.trips;


        }


    }).error(function myerror(err){
          console.log(err);
    });

    $scope.gentripbill=function (user_id,total_price,property_id,start_date,end_date,transaction_id,transaction_date) {
        var doc = new jsPDF();
        var name="sharat";
        // doc.text(35, 25, "Paranyan loves jsPDF");
        //doc.text('Hello world!+name'+name+'so whats your local name', 10, 10);
        //doc.text('Booking Id:'+booking_id,10,20);
        doc.text('Your Trip Bill --Airbnb',10,25);
        doc.text('Booking Cost:'+total_price,10,25);
        doc.text('Host id:'+user_id,10,30);
        doc.text('property id:'+property_id,10,35);
        doc.text('start date:'+start_date,10,40);
        doc.text('end date:'+end_date,10,45);
        doc.text('Transaction id:'+transaction_id,10,50);
        doc.text('Transaction date:'+transaction_date,10,55);
        doc.save('billing_receipt.pdf');
    };

    $scope.genrevbill=function (user_id,total_price,property_id,start_date,end_date,booking_id) {
        var doc = new jsPDF();
        var name="sharat";
        // doc.text(35, 25, "Paranyan loves jsPDF");
        //doc.text('Hello world!+name'+name+'so whats your local name', 10, 10);
        //doc.text('Booking Id:'+booking_id,10,20);
        doc.text('Your Revenue Bill --Airbnb',10,25);
        doc.text('Booking Cost:'+total_price,10,25);
        doc.text('Customer id:'+user_id,10,30);
        doc.text('property id:'+property_id,10,35);
        doc.text('start date:'+start_date,10,40);
        doc.text('end date:'+end_date,10,45);
        doc.text('Transaction id:'+booking_id,10,50);
        //doc.text('Transaction date:'+transaction_date,10,55);
        doc.save('revenue_receipt.pdf');
    }


    //review by user based on billing part

    var review_host_id,review_property_id,review_transaction_id,review_title;
    $scope.params1=function(host_id,property_id,transaction_id,title)
    {
        console.log(host_id);
        review_host_id=host_id;
        review_property_id=property_id;
        review_transaction_id=transaction_id;
        review_title=title;


        $scope.propertyreview=false;


    };

    $scope.reviewbyuser=function(image,userreview,userratings) {

        console.log("inside review by users");
        console.log(review_transaction_id);
        console.log(userreview);
        console.log(image);
        var files=[];
        files.push(image);
        Upload.upload({

            url:'/postuserreview',
            data:{


                transaction_id:review_transaction_id,
                host_id: review_host_id,
                files:files,
                property_id:review_property_id,
                property_title:review_title,
                user_review:userreview,
                user_ratings:userratings


            }

        }).then(function(response){
            console.log(response);
            alert(response.statusCode);
            if(response.data.statusCode==200)
            {
                window.alert("Property Added");
               // window.location.assign("/homepage");
            }
            else
            {
                window.alert("Property couldnt be added");
            }
        },function(err){
            console.log(err);
        });


    }


    //review by host based on revenue part


    var host_user_id,host_property_id,host_booking_id,host_transaction_id;
    $scope.params2=function(user_id,property_id,booking_id,transaction_id)
    {
        host_user_id=user_id;
        host_property_id=property_id;
        host_booking_id=booking_id;
        host_transaction_id=transaction_id;

       $scope.submithost=false;
        $scope.submituser=true;


    };




    $scope.reviewbyhost=function(hostreview,hostratings){

        console.log("inside review by host");
        console.log(host_property_id);
        console.log(hostreview);


        $http({
            method:'post',
            url:'/posthostreview',
            data:{
                booking_id:host_booking_id,
                user_id: host_user_id,
                transaction_id:host_transaction_id,
                property_id:host_property_id,

                user_review:hostreview,
                user_ratings:hostratings
            }

        }).success(function mysucess(response){
            console.log(response);
            if(response.statusCode==200)
            {
                console.log("inside statuscode 200");
                window.alert("host review added");
            }
            else
            {
                window.alert("some problem while adding the host review");
            }
        }).error(function myerror(err){
            console.log(err);
        });

    }


}]);


userwindow.controller('listingcontroller',function ($scope,$http) {

    console.log("inside listing controller");

    $scope.nothost=true;
    $scope.host=false;

    $http({
        method:'get',
        url:'/getlisting'
    }).success(function mysuccess(response){
           console.log(response);

        if(response.host)
        {
            if(response.isempty)
            {
                //no listing
            }
            else
            {
                $scope.listing=response.listing;
            }
        }
        else
        {
            //not a host yet
            $scope.nothost=false;
            $scope.host=true;
        }

    }).error(function myerror(err){
          console.log(err);
    });


    $scope.editlisting=function(property_id) {
        window.location.href = "editlisting?pid=" + property_id;
    }


    $scope.deletelisting=function(property_id)
    {
        console.log("inside deletelisting");
        console.log(property_id);

        $http({
            method:'post',
            url:'/removeProperty',
            data:{
                property_id:property_id
            }
        }).success(function mysuccess(response){
             console.log(response);
            if(response.statusCode==200)
            {
                window.alert("property removed");
                window.location.href="userwindow";

            }
            else
            {
                window.alert("some problem while removing properties");
                window.location.href="userwindow";
            }

        }).error(function myerror(err){
            console.log("error");

        });
    }

});



userwindow.controller('HostStatsController',function ($scope,$http) {
    console.log("Inside Host Stats Controller");

    $scope.getByID=function () {

        var graphx = [];
        var labels = [];
        $http({
            method: "POST",
            url: "/hostStat",
            data:{
                "pid":$scope.propID
            }
        }).success(function (data) {

            if (data.result != "failure") {
                for (i in data){
                    graphx.push(data[i].count);
                    labels.push(data[i]._id);
                }

            }
            else
                alert("Error in retreiving top properties from cloud db");

            var ctx = document.getElementById("propertyCount").getContext("2d");
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Views by timestamp',
                        data: graphx,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1,
                        hoverBackgroundColor: "#B0E0E6"
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            gridLines: {
                                drawOnChartArea: false
                            }
                        }
                        ],
                        xAxes: [{
                            gridLines: {
                                drawOnChartArea: false
                            }
                        }
                        ],

                    },


                },


            });


        });

        $http({
            method: "POST",
            url: "/getpropertyRating",
            data:{
                "pid":$scope.propID
            }
        }).success(function (data) {

            if (data.result != "failure") {
                $scope.ratingsob=true;
                $scope.averageRatings=data[0].avgQuantity,
                    $scope.of=data[0].count;
            }
            else
                alert("Error in retreiving top properties from cloud db");

        });

        $http({
            method: "POST",
            url: "/getBidTrace",
            data:{
                "pid":$scope.propID
            }
        }).success(function (data) {

            tracex=[];
            tracelabel=[];
            if (data.result != "failure") {
                for (i in data){
                    tracelabel.push(data[i].timestamp);
                    tracex.push(data[i].amount);
                }
            }
            else
                alert("Error in retreiving top properties from cloud db");


            var dataline = {
                labels: tracelabel,
                datasets: [
                    {
                        label: "Bidding Amount",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: tracex,
                        spanGaps: false,
                    }
                ]
            };


            var rad = document.getElementById("ptrace").getContext("2d");

            var myLineChart = new Chart(rad, {
                type: 'line',
                data: dataline
            });

        });



    }


});
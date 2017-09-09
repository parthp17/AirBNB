var app = angular.module('mainModule', ['ui.router', 'ngMaterial']);

app.config(function ($stateProvider, $urlRouterProvider) {
    // $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('approvals', {
            url: '/approvals',
            templateUrl: "templates/approvals.ejs",
            controller: "ApprovalsController"
        })

        .state('popular', {
            url: '/popular',
            templateUrl: "templates/popular.ejs",
            controller: "trendingPropertiesController"
        })

        .state('traffic', {
            url: '/traffic',
            templateUrl: "templates/traffic.ejs",
            controller: "userTrafficController"
        })

        .state('hosts', {
            url: '/hosts',
            templateUrl: "templates/hosts.ejs",
            controller: "displayHostsController"
        })

        .state('reviews', {
            url: '/reviews',
            templateUrl: "templates/reviews.ejs",
            controller: "cityRevenueController"
        })

        .state('performance', {
            url: '/performance',
            templateUrl: "templates/performance.ejs",
            controller: "performanceDisplayController"
        })

        .state('searchHost', {
            url: '/searchHost',
            templateUrl: "templates/searchHost.ejs",
            controller: "searchHostsController"
        })

        .state('billing', {
            url: '/billing',
            templateUrl: "templates/billing.ejs",
            controller: "billingController"
        })

        .state('logout', {
            url: '/logout',
            controller: "logoutController"
        })

        .state('users', {
            url: '/users',
            templateUrl: "templates/trackuser.ejs",
            controller: "trackUserController"
        })
});

app.controller('trackUserController',function ($scope,$http) {


    $scope.trackUser=function () {

        $http({
            "method":"POST",
            "url":"/trackUser",
            "data":{
                "name":$scope.name
            }
        }).success(function (data) {
            var values=[];
            var values2=[];
            for(i in data){
                var value=[];
                var value2=[];
                value.push(moment(data[i].timestamp).format("MMM Do, h:mm:ss") );//"2013-03-10"data[i].timestamp);
                value.push(data[i].page);
                value.push(20)

                value2.push(moment(data[i].timestamp).format("MMM Do, h:mm:ss"));
                value2.push(data[i].activity);
                value2.push(20)

                values.push(value);
                values2.push(value2);
            }

            alert("Values :"+values);
            var myConfig1 = {

                "type": "bubble",
                "plotarea":{
                    "adjust-layout":true
                },
                "series": [
                    {
                        "values":values
                    }
                ]
            };

            var myConfig2 = {

                "type": "bubble",
                "plotarea":{
                    "adjust-layout":true
                },
                "series": [
                    {
                        "values":values2
                    }
                ]
            };


            zingchart.render({
                id : 'myChart',
                data : myConfig1,
                height : "80%",
                width: "100%"
            });

            zingchart.render({
                id : 'myChart2',
                data : myConfig2,
                height : "80%",
                width: "100%"
            });

        });
    }




})

app.controller('searchHostsController', function ($scope, $http) {
    $scope.getHosts = function () {
        var city = $scope.area;
        // alert (city);
        $http({
            "method": "POST",
            "url": "/getHosts",
            "data": {
                "city": city
            }
        }).success(function (data) {
            if (data.result != "failure")
                $scope.allhosts = data;
            else
                alert("Error in retrieving hosts from cloud db");
        });
    }
});


app.controller('logoutController', function ($scope, $http) {
    $http({
        method: "GET",
        url: "/logout",
    }).success(function (data) {
        if (data == 'logout')
            window.location.assign("/admin");
        else
            alert(data);
    });
})

app.controller('billingController', function ($scope, $http) {

    $scope.fetchBills = function (filter) {
        if (filter == 'date') {
            $http({
                "method": "post",
                "url": "/fetchBills",
                "data": {
                    "package": {
                        "type": "date",
                        "start": $scope.startDate,
                        "end": $scope.endDate
                    }

                }
            }).success(function (data) {
                if (data.result != "failure")
                    $scope.information = data;
                else
                    alert("Error in retrieving bills from cloud db");
            });
        }

        if (filter == 'id') {
            $http({
                "method": "post",
                "url": "/fetchBills",
                "data": {
                    "package": {
                        "type": "id",
                        "id": $scope.bookingid
                    }

                }
            }).success(function (data) {
                if (data.result != "failure")
                    $scope.information = data;
                else
                    alert("Error in retreiving top properties from cloud db");
            });
        }

        if (filter == 'all') {
            $http({
                "method": "post",
                "url": "/fetchBills",
                "data": {
                    "package": {
                        "type": "all"
                    }

                }
            }).success(function (data) {
                if (data.result != "failure")
                    $scope.information = data;
                else
                    alert("Error in retreiving top properties from cloud db");
            });
        }
    }

});

app.controller('trendingPropertiesController', function ($scope, $http) {


    $http({
        method: "get",
        url: "/topProperties",
    }).success(function (data) {
        if (data.result != "failure")
            $scope.properties = data;
        else
            alert("Error in retreiving top properties from cloud db");
    })

    // var ctx1 = document.getElementById("popularbars").getContext("2d");
    // var myChart = new Chart(ctx1, {
    //     type: 'bar',
    //     data: {
    //         labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //         datasets: [{
    //             label: 'Hits',
    //             data: [12, 19, 3, 5, 2, 3],
    //             backgroundColor: [
    //                 'rgba(255, 99, 132, 0.2)',
    //                 'rgba(54, 162, 235, 0.2)',
    //                 'rgba(255, 206, 86, 0.2)',
    //                 'rgba(75, 192, 192, 0.2)',
    //                 'rgba(153, 102, 255, 0.2)',
    //                 'rgba(255, 159, 64, 0.2)'
    //             ],
    //             borderColor: [
    //                 'rgba(255,99,132,1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(255, 159, 64, 1)'
    //             ],
    //             borderWidth: 1,
    //             hoverBackgroundColor: "#B0E0E6"
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     beginAtZero:true
    //                 },
    //                 gridLines:{
    //                     drawOnChartArea:false
    //                 }
    //             }
    //             ],
    //             xAxes: [{
    //                 gridLines:{
    //                     drawOnChartArea:false
    //                 }
    //             }
    //             ],
    //
    //         },
    //
    //
    //     },
    //
    //
    // });
    //
    //
    //
    // var data2 = {
    //     datasets: [
    //         {
    //             label: 'Dataset',
    //             data: [
    //                 {
    //                     x: 20,
    //                     y: 30,
    //                     r: 15
    //                 },
    //                 {
    //                     x: 40,
    //                     y: 10,
    //                     r: 10
    //                 },
    //                 {
    //                     x: 32,
    //                     y: 37,
    //                     r: 14
    //                 },
    //                 {
    //                     x: 75,
    //                     y: 32,
    //                     r: 12
    //                 },
    //                 {
    //                     x: 78,
    //                     y: 32,
    //                     r: 19
    //                 },
    //                 {
    //                     x: 55,
    //                     y: 52,
    //                     r: 13
    //                 },
    //                 {
    //                     x: 56,
    //                     y: 80,
    //                     r: 10
    //                 }
    //
    //             ],
    //             backgroundColor:"#B0E0E6",
    //             hoverBackgroundColor: "White",
    //         }]
    // };
    //
    // var bub2 = document.getElementById("bubbles2").getContext("2d");
    // var myBubbleChart = new Chart(bub2,{
    //     type: 'bubble',
    //     data: data2,
    //     options: {
    //
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     beginAtZero:true
    //                 },
    //                 gridLines:{
    //                     drawOnChartArea:false
    //                 }
    //             }
    //             ],
    //             xAxes: [{
    //                 gridLines:{
    //                     drawOnChartArea:false
    //                 }
    //             }
    //             ],
    //
    //         },
    //
    //         elements: {
    //             points: {
    //                 borderWidth: 1,
    //                 borderColor: 'rgb(0, 0, 0)',
    //
    //             },
    //
    //         }
    //
    //     }
    // });


})

app.controller('displayHostsController', function ($scope, $http) {
    var graphx = [];
    var labels = [];
    $http({
        method: "get",
        url: "/topHosts",
    }).success(function (data) {
        if (data.result != "failure") {
            for (i in data) {
                graphx.push(data[i].count);
                labels.push(data[i].host_id);
            }
        }
        else
            alert("Error in retreiving top properties from cloud db");


        var ctx = document.getElementById("hoststat").getContext("2d");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Hits',
                    data: graphx,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
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
})

app.controller('performanceDisplayController', function ($scope, $http) {
    var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
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
                data: [65, 59, 80, 81, 56, 55, 40],
                spanGaps: false,
            },
            {
                label: "My Second Dataset",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "grey",
                borderColor: "grey",
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
                data: [35, 76, 84, 71, 56, 75, 90],
                spanGaps: false,
            }
        ]
    };

    var rad = document.getElementById("line").getContext("2d");

    var myLineChart = new Chart(rad, {
        type: 'line',
        data: data
    });
})

app.controller('reviewsController', function ($scope, $http) {

    var data = {
        labels: [
            "Red",
            "Blue",
            "Yellow"
        ],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ]
            }]
    };

    var don = document.getElementById("bubbles").getContext("2d");

    var myDoughnutChart = new Chart(don, {
        type: 'doughnut',
        data: data,

    });


    var data2 = {
        labels: [
            "Red",
            "Blue",
            "Yellow"
        ],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ]
            }]
    };

    var don2 = document.getElementById("bubbles2").getContext("2d");

    var myDoughnutChart2 = new Chart(don2, {
        type: 'doughnut',
        data: data2,

    });
})

app.controller('userTrafficController', function ($scope, $http) {
    var graphx = [];
    var labels = [];
    $http({
        method: "get",
        url: "/topProperties",
    }).success(function (data) {
        if (data.result != "failure") {
            for (i in data) {
                graphx.push(data[i].count);
                labels.push(data[i].title);
            }
        }
        else
            alert("Error in retreiving top properties from cloud db");

        var ctx = document.getElementById("mycanvas").getContext("2d");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Top Properties',
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


    var data = {

        datasets: [
            {
                label: 'Dataset',
                data: [
                    {
                        x: 20,
                        y: 30,
                        r: 15
                    },
                    {
                        x: 40,
                        y: 10,
                        r: 10
                    },
                    {
                        x: 32,
                        y: 37,
                        r: 14
                    },
                    {
                        x: 75,
                        y: 32,
                        r: 12
                    },
                    {
                        x: 78,
                        y: 32,
                        r: 19
                    },
                    {
                        x: 55,
                        y: 52,
                        r: 13
                    },
                    {
                        x: 56,
                        y: 80,
                        r: 10
                    }

                ],
                backgroundColor: "#B0E0E6",
                hoverBackgroundColor: "White",
            }]
    };

    var bub = document.getElementById("bubbles").getContext("2d");
    var myBubbleChart = new Chart(bub, {
        type: 'bubble',
        data: data,
        options: {
            elements: {
                points: {
                    borderWidth: 1,
                    borderColor: 'rgb(0, 0, 0)'
                }
            }
        }
    });



    $http({
        "method": "get",
        "url": "/lessSeen"
    }).success(function (pagedata) {

        alert(JSON.stringify(pagedata));
        var label = [];
        var pagecount = [];
        for (i in pagedata) {
            label.push(pagedata[i]._id);
            pagecount.push(pagedata[i].count);
        }
            var data = {
                labels: label,
                datasets: [{
                    data: pagecount,
                    backgroundColor: [
                        "#FF6384",
                        "#4BC0C0",
                        "#FFCE56",
                        "#E7E9ED",
                        "#36A2EB"
                    ],
                    label: 'My dataset' // for legend
                }],

            };

        var pol = document.getElementById("Polar").getContext("2d");

        new Chart(pol, {
            data: data,
            type: 'polarArea',
            options: {
                elements: {
                    arc: {
                        borderColor: "#B0E0E6"
                    }
                }
            }
        });

    });



    $http({
        "method": "get",
        "url": "/clicksPerPage"
    }).success(function (pagedata) {
        var label = [];
        var pagecount = [];
        for (i in pagedata) {
            label.push(pagedata[i]._id);
            pagecount.push(pagedata[i].count);

        }
        var data = {
            labels: label,
            datasets: [
                {
                    label: "Total Clicks",
                    backgroundColor: "rgba(179,181,198,0.2)",
                    borderColor: "rgba(179,181,198,1)",
                    pointBackgroundColor: "rgba(179,181,198,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(179,181,198,1)",
                    data: pagecount
                }
            ]
        };

        var rad = document.getElementById("Radar").getContext("2d");

        new Chart(rad, {
            data: data,
            type: 'radar',
            options: {
                elements: {
                    arc: {
                        borderColor: "#B0E0E6"
                    }
                }
            }
        });

    });


})


app.controller('cityRevenueController', function ($scope, $http) {
    var graphx2 = [];
    var labels2 = [];

    $http({
        method: "get",
        url: "/cityRevenue",
    }).success(function (data) {
        if (data.result != "failure") {

            for(i in data)
            {
                graphx2.push(data[i].revenue);
                labels2.push(data[i].city);
            }


        }
        else
            alert("Error in retreiving top properties from cloud db");

        var ctx = document.getElementById("bubbles").getContext("2d");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels2,
                datasets: [{
                    label: 'Revenue',
                    data: graphx2,
                    backgroundColor: [
                        'lightblue'
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

})

app.controller('ApprovalsController', function ($scope, $http) {

    $http({
        method: "GET",
        url: '/getPending',
    }).success(function (data) {

        $scope.hosts = data;

    });

    $scope.approve = function (host_id, index) {
        $http({
            method: "POST",
            url: '/approve',
            data: {
                "host_id": host_id,
                "approval": "TRUE"
            }
        }).success(function (data) {
            $scope.hosts.splice(index,1);
            $scope.approval = true;
        });
    }

    $scope.disapprove = function (host_id, index) {

        $http({
            method: "POST",
            url: '/approve',
            data: {
                "host_id": host_id,
                "approval": "FALSE"
            }
        }).success(function (data) {
            $scope.hosts.splice(index,1);
        });
    }
})

app.controller('adminLoginController', function ($scope, $http) {
    $scope.valid = true;
    $scope.present = true;
    $scope.inserterr = true;

    $scope.login = function (valid) {

        $scope.valid = true;
        $http({
            method: "POST",
            url: '/verifyAdmin',
            data: {
                "username": $scope.username,
                "password": $scope.password
            }
        }).success(function (data) {

            if (data.result == "success") {

                window.location.assign("/admindash");

            }

            else if (data.result == "invalid") {
                $scope.valid = false;
            }
            else {
                $scope.valid = false;
                alert("Please try again later!");
            }
        })
    }

    $scope.register = function (valid) {
        $scope.valid = true;
        // alert("Admin Login Controller Activated");
        $http({
            method: "POST",
            url: '/registerAdmin',
            data: {
                "username": $scope.username,
                "password": $scope.password,
                "fname": $scope.newfname,
                "lname": $scope.newlname,
                "auth": $scope.authno
            }
        }).success(function (data) {
            if (data.result == "success") {
                alert("Registration Successful!")
            }
            else if (data.result == "invalid") {
                $scope.valid = false;
                $scope.present = false;
            }
            else if (data.result == "unauthorised")
                alert("Unauthorized Registration Detected!");
            else {
                $scope.valid = false;
                $scope.inserterr = false;
            }
        })
    }

});

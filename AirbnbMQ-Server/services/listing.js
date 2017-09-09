var ejs=require("ejs");
var http=require("http");
var mysql=require("./mysql");
var connect = require('./mysqlconnect1');


exports.getlist=function(req,msg,callback){


    try{

        console.log("inside listing.js getlist");

        var userid=msg.userid;
        var hostid=msg.hostid;

        var activation=1;

        var res={};

        console.log(userid,hostid);

        if(hostid!=undefined) {
            var query = "select * from properties where host_id='" + hostid + "' and activation='" + activation + "'";

            mysql.fetchData(function (err, results) {

                if (err) {
                    console.log(err);
                    throw err;
                }
                else {
                    console.log(results);
                    if (results.length > 0) {
                        res = {
                            "list": true,
                            "count":true,
                            "listing": results
                        };
                        console.log(res);
                        callback(req, res);
                    }
                    else {
                        res = {
                            "list": true,
                            "count":false
                        };
                        callback(req, res);
                    }
                }
            }, query);

        }
        else
        {
            res = {
                "list": false
            };
            callback(req, res);
        }

    }
    catch(e)
    {
        var res={};

        res.statusCode=404;
        res.message="Server could not server the request";

        callback(null,res);
    }




};
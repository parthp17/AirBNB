var ejs = require("ejs");
var mq_client = require('../rpc/client');
var logger = require('./auction');
var dateTime = require('./DateTime');

function sign_in(req,res) {

    ejs.renderFile('./views/signin.ejs',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}

function after_sign_in(req,res)
{
    // check user already exists
    var username = req.param("username");
    var password = req.param("password");
    var msg_payload = { "username": username, "password": password };

    console.log("In POST Request = UserName:"+ username+" "+password);

    mq_client.make_request('login_queue',msg_payload, function(err,results){

        console.log(results);
        if(err){
            throw err;
        }
        else
        {
            if(results.code == 200){
                console.log("valid Login");

                res.send({"login":"Success"});
            }
            else {

                console.log("Invalid Login");
                res.send({"login":"Fail"});
            }
        }
    });

}


function success_login(req,res)
{
    ejs.renderFile('./views/success_login.ejs',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}


function fail_login(req,res)
{
    ejs.renderFile('./views/fail_login.ejs',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}
function search(req,res)
{
    // check user already exists
    var where = req.param("where");
    req.session.where = where;
    var checkin = req.param("checkin");
    req.session.checkin = checkin;
    var checkout = req.param("checkout");
    req.session.checkout = checkout;
    var guests = req.param("guests");
    // var res = guests.split(" ");
    var arr = guests.split(" ").map(function (val) {
        return Number(val);
    });
    req.session.guests = arr[0];
    console.log(arr[0]);
    var search_json = {
        "user_id":req.session.userid,"user_name":req.session.fname+" "+req.session.lname, "city":where, "timestamp": new Date().toString()
    };
    // logger.log('info', "auction_id"+ row.auction_id +" max bid: " +row.bid_price +  " time: "+ new Date().toString());
    logger.user_logger.log('info', search_json);
    var msg_payload = {"where": where, "checkin": checkin, "checkout": checkout, "guests":arr[0]};

    console.log("In POST Request = search for:"+ where);

    mq_client.make_request('search_queue', msg_payload, function(err,results){


        if(err){
            throw err;
        }
        else
        {
            if(results.code == 200){
                // console.log(results.value);
                console.log("valid search");
                var i = 0;
                for(;i<results.value.data.length;i++){
                    results.value.data[i].image = results.array[i];
                }
                console.log(results.value.data);
                req.session.listing = results.value.data;
                res.send({"statusCode": 200, "login":"Success", "results": results.value.data});
            }
            else {

                console.log("Invalid search");
                res.send({"statusCode": 401, "login":"Fail"});
            }
        }
    });

}

function getAllProperties(req,res)
{

    var msg_payload = {"user": "req.session.user"};

    console.log("In POST Request = get all properties:");

    mq_client.make_request('getAllProperties_queue', msg_payload, function(err,results){

        if(err){
            throw err;
        }
        else
        {
            if(results.code == 200){
                // console.log(results.value.data);
                console.log("valid properties");
                // console.log(results.array);
                var i = 0;
                for(;i<6;i++){
                    results.value.data[i].image = results.array[i];
                }
                console.log(results.value.data);
                // req.session.listing = results.value.data;
                res.send({"statusCode": 200, "login":"Success", "results": results.value.data});
            }
            else {

                console.log("Invalid properties");
                res.send({"statusCode": 401, "login":"Fail"});
            }
        }
    });

}

function filter(req,res)
{
    var where = req.param("where");
    var checkin = req.param("checkin");
    var checkout = req.param("checkout");
    var guests = req.param("guests");
    var home = req.param("home");
    var apartment = req.param("apartment");
    var villa = req.param("villa");
    var castle = req.param("castle");
    var minValue = req.param("minValue");
    var maxValue = req.param("maxValue");

    var msg_payload = {"where": where, "checkin":checkin,"checkout":checkout,"guests":guests,"home":home,"apartment":apartment,"villa":villa,"castle":castle,"minValue":minValue,"maxValue":maxValue };

    console.log("In POST Request = filter all properties:");

    mq_client.make_request('filter_queue', msg_payload, function(err,results){

        if(err){
            throw err;
        }
        else
        {
            if(results.code == 200 && results.value.data.length > 0){
                console.log(results.value);
                console.log("valid filter");
                var i = 0;
                for(;i<results.value.data.length;i++){
                    results.value.data[i].image = results.array[i];
                }
                console.log(results.value.data);
                req.session.listing = results.value.data;
                res.send({"statusCode": 200, "login":"Success", "results": results.value.data});
            }
            else if(results.code == 200 && results.value.data.length <= 0){
                console.log("results.value.data is empty");
                req.session.listing = results.value.data;
                res.send({"statusCode": 300, "login":"Success", "results": results.value.data});
            }
            else {

                console.log("Invalid search");
                res.send({"statusCode": 401, "login":"Fail"});
            }
        }
    });

}

exports.filter = filter;
exports.getAllProperties=getAllProperties;
exports.search = search;
exports.sign_in=sign_in;
exports.after_sign_in=after_sign_in;
exports.success_login=success_login;
exports.fail_login=fail_login;
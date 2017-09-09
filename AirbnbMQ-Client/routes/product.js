var ejs = require("ejs");
var mq_client = require('../rpc/client');
var dateTime = require('./DateTime');
var logger = require('./auction');

exports.property = function (req, res) {


    try {

        res.render('property.ejs',function(err, result) {
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
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }


}

exports.displayProperty = function (req, res) {

    //store product-id in session
    var id = req.param("property_id");
    var price = req.param("property_price");
    req.session.property_id = id;
    var property_click_json = {
        "user_id":req.session.userid,"user_name":req.session.fname+" "+req.session.lname, "amount": price,"property_id": id, "timestamp": new Date().toString()
    };
    logger.user_logger.log('info', property_click_json);

    var msg_payload = { "property_click_json": property_click_json};

    console.log("In POST Request = property_id:"+ req.session.property_id);

    mq_client.make_request('logging_queue',msg_payload, function(err,results){

        console.log(results);
        if(err){
            throw err;
        }
        else
        {
            if(results.code == 200){
                console.log("logging");

                res.send({"statusCode":200});
            }
            else {

                console.log("Invalid property");
                res.send({"property":"Fail"});
            }
        }
    });

}

exports.display_property = function (req, res) {

    res.render("property.ejs");
}

exports.propertydetails = function(req,res)
{


    try {

        console.log("in propertydetails");
        var msg_payload = { "property_id": req.session.property_id};

        console.log("In POST Request = property_id:"+ req.session.property_id);

        mq_client.make_request('property_queue',msg_payload, function(err,results){

            console.log(results);
            if(err){
                throw err;
            }
            else
            {
                if(results.code == 200){
                    console.log("valid propertyyyyy");
                    console.log(results.value[0].title);
                    console.log("bid");
                    console.log(results.bid);
                    console.log(results.reviewsByUser);
                    res.send({"statusCode":200,"property":results.value,"bid":results.bid,"reviews":results.reviewsByUser});
                }
                else {

                    console.log("Invalid property");
                    res.send({"property":"Fail"});
                }
            }
        });


    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }

}

function getCurrentDateTime(check)
{
    var date = new Date(check);
    date = date.getFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' +
        ('00' + date.getHours()).slice(-2) + ':' +
        ('00' + date.getMinutes()).slice(-2) + ':' +
        ('00' + date.getSeconds()).slice(-2);
    return date;
}

exports.getCurrentDateTime=getCurrentDateTime;

exports.change = function(req,res)
{


    try {

        console.log("in change");

        var checkin=req.param("checkin");
        var checkout=req.param("checkout");
        var guests=req.param("guests");
        console.log(checkin);
        console.log(checkout);
        var checkin = getCurrentDateTime(checkin);
        var checkout = getCurrentDateTime(checkout);


        var msg_payload = { "property_id": req.session.property_id, "checkin":checkin,"checkout":checkout, "guests":guests};

        console.log("In POST Request = checkin,checkout,property_id:"+ req.session.property_id + checkout + checkin);

        mq_client.make_request('change_queue',msg_payload, function(err,results){

            console.log(results);
            if(err){
                throw err;
            }
            else
            {
                if(results.code == 200){
                    res.send({"statusCode":200});
                }
                else {

                    console.log("Invalid property");
                    res.send({"property":"Fail"});
                }
            }
        });


    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }

}

exports.details = function(req,res){


    try {

        var enumber =  req.param("number");
        var emonth =  req.param("month");
        var eyear =  req.param("year");
        var ecvv =  req.param("cvv");

        console.log("number entered " + enumber);

        console.log("expiry month " + emonth);
        console.log("expiry year " + eyear);
        console.log("cvv number " + ecvv);

        var len1=enumber.length;
        var len2=ecvv.length;

        var enteredDate = new Date(eyear+'-'+emonth);

        var today=new Date();
        var month=(today.getMonth()+1).toString();
        var year=(today.getFullYear()).toString();

        var str1=eyear+emonth;
        var str2=year+month;

        console.log(str1);
        console.log(str2);

        console.log("month" + month);
        console.log("year" + year);


        if(len1==16 && isNaN(enumber)==false){
            if(len2==3 && isNaN(enumber)==false){
                if(enteredDate>=today){
                    res.send({"statusCode": 200});
                }
                else{
                    res.send({"title" : 'Please enter valid card number!'});
                }
            }
            else{
                res.send({"title" : 'Please enter valid cvv number!'});
            }
        }
        else{
            res.send({"title" : 'Please enter valid card number!'});
        }

    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }


};


exports.payment = function(req, res){
    res.render('payment');
};

function make_bid(req,res)
{


    try {

        console.log("in make_bid function")
        // check user already exists
        var bid = req.param("bid");
        var user_id = 100000000;
        var property_id = req.session.property_id;
        console.log(property_id);
        var msg_payload = { "user_id": user_id, "property_id": property_id, "bid": bid, "date" : dateTime.getCurrentDateTime()};

        console.log("In POST Request to make a bid = user_id:"+ user_id);

        mq_client.make_request('bid_queue',msg_payload, function(err,results){

            console.log(results);
            if(err){
                throw err;
            }
            else
            {
                if(results.code == 200){
                    console.log("valid bid" + results.value);

                    res.send({"statusCode":200, "result": results.value});
                }
                else {

                    console.log("Invalid bid");
                    res.send({"login":"Fail"});
                }
            }
        });


    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }
}

exports.make_bid = make_bid;

function load(req,res)
{


    try {

        console.log("in payment load function")
        // check user already exists
        var user_id = 100000000;

        var msg_payload = { "user_id": user_id };

        console.log("In POST Request = user_id:"+ user_id);

        mq_client.make_request('load_queue',msg_payload, function(err,results){

            console.log(results);
            if(err){
                throw err;
            }
            else
            {
                if(results.code == 200){
                    console.log("valid Login");

                    res.send({"statusCode":200, "result": results.value});
                }
                else {

                    console.log("Invalid Login");
                    res.send({"login":"Fail"});
                }
            }
        });

    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }


}

exports.load=load;

function enter(req,res){

    try {

        var enumber =  req.param("number");
        var emonth =  req.param("month");
        var eyear =  req.param("year");
        var ecvv =  req.param("cvv");

        console.log("number entered " + enumber);

        console.log("expiry month " + emonth);
        console.log("expiry year " + eyear);
        console.log("cvv number " + ecvv);

        var len1=enumber.length;
        var len2=ecvv.length;

        var enteredDate = new Date(eyear+'-'+emonth);

        var today=new Date();
        var month=(today.getMonth()+1).toString();
        var year=(today.getFullYear()).toString();

        var str1=eyear+emonth;
        var str2=year+month;

        console.log(str1);
        console.log(str2);

        console.log("month" + month);
        console.log("year" + year);


        if(len1==16 && isNaN(enumber)==false){
            if(len2==3 && isNaN(enumber)==false){
                if(enteredDate>=today){
                    var msg_payload = { "enumber": enumber , "emonth": emonth, "eyear": eyear };
                    console.log("in enter function");
                    console.log("In POST Request: Exp. month"+ emonth);

                    mq_client.make_request('add_queue',msg_payload, function(err,results){

                        console.log("Results for guest capacity :" + JSON.stringify(results));
                        if(err){
                            throw err;
                        }
                        else
                        {
                            if(results.code == 200){
                                console.log("price found");
                                res.send({"statusCode": 200});
                            }
                            else {

                                console.log("Invalid num of guests");
                                res.send({"statusCode": 300});
                            }
                        }
                    });
                }
                else{
                    res.send({"title" : 'Please enter valid card number!'});
                }
            }
            else{
                res.send({"title" : 'Please enter valid cvv number!'});
            }
        }
        else{
            res.send({"title" : 'Please enter valid card number!'});
        }



    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }


}

exports.enter=enter;
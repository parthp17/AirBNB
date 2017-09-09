var ejs=require("ejs");
var http=require("http");
var mq_client = require('../rpc/client');

exports.homepage=function(req,res)
{


    try {

        console.log("should redircect to homepage");
        //C:\Users\Sharat Hegde\WebstormProject\My_273_teamproject\AirbnbMQ-Client\views\homepage.ejs
        ejs.renderFile('./views/homepage.ejs',function (err,result){

            if (!err)
            {
                console.log("no error");
                res.end(result);
            }
            // render or error
            else
            {
                console.log(err);
                res.end('An error occurred');

            }

        });



    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }



};

exports.requser=function(req,res){

    var user=req.session.user;
    if(user!=undefined&&user!="guest")
    {
        var response={
            code:200,
            user:user
        };
        res.send(response);
    }
    else
    {
        var response={
            code:400
        };
        res.send(response);
    }
};


exports.userwindow=function (req,res) {


    try {

        console.log("inside the userwindow function");

        var userid=req.session.userid;
        var msg_payload={
            userid:userid
        };

        mq_client.make_request('gethostid_queue',msg_payload,function(err,results){

            if(err)
            {
                throw err;
            }
            else
            {
                console.log(results.hostid);
                req.session.hostid=results.hostid;
                res.render('userwindow', { title: 'Express' });
            }
        });


    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }






};
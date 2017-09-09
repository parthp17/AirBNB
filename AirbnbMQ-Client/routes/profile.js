var ejs=require("ejs");
var http=require("http");
var mq_client=require('../rpc/client');

exports.getuserprofile=function(req,res){


    try {

        console.log("inside getuserprofile");

        var user=req.session.user;

        var msg_payload={
            "user":user
        };

        mq_client.make_request('profilereq_queue',msg_payload,function (err,results) {

            if(err)
            {
                throw err;
            }
            else
            {
                console.log(results);

                /* var result={
                 value:results.data
                 }; */

                json_responses = {
                    statusCode: 200,
                    data:results.data
                };

                console.log("Response is:" + JSON.stringify(json_responses));
                res.send(json_responses);

                /*
                 console.log("object"+result);
                 res.send(result);
                 */

            }
        });



    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }



};


exports.updateprofile=function(req,res){

    try {

        console.log("update profile in profile.js");
        console.log(req.param("firstname"));
        // var user=req.session.user;
        var user_id = req.session.userid;
        var fname=req.param("firstname");
        var lname=req.param("lastname");
        //var email=req.param("email");
        // var password=req.param("password");
        var line1=req.param("line1");
        var line2=req.param("line2");
        var city=req.param("city");
        var state=req.param("state");
        var country=req.param("country");
        var zipcode=req.param("zipcode");
        var mobnum=req.param("mobnum");
        var files = req.files;
        console.log(fname);

        var msg_payload={
            "user_id":user_id,
            "fname":fname,
            "lname":lname,


            "line1":line1,
            "line2":line2,
            "city":city,
            "state":state,
            "country":country,
            "zipcode":zipcode,
            "mobnum":mobnum,
            "user_id":req.session.userid,
            files:files
        };
        console.log(fname);
        mq_client.make_request('updateprofile_queue',msg_payload,function(err,results){
            console.log(results);
            if(err)
            {
                throw err;
            }
            else
            {
                if(results.code==200)
                {
                    json_response={"statusCode":200};
                    res.send(json_response);
                }
            }
        });

    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }


};


exports.logout=function(req,res){

    console.log("inside logout in profile.js");

    req.session.destroy();

    json_response={"statusCode":200};

    res.send(json_response);


};
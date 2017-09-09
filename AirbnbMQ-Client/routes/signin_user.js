var ejs=require("ejs");
var http=require("http");
var mq_client=require('../rpc/client');

exports.signin=function(req,res){


    try {

        console.log("inside signin_user.js");

        var username=req.param("username");
        var password=req.param("password");

        var msg_payload={
            "username":username,
            "password":password
        };

        console.log("msg payload:"+msg_payload);

        mq_client.make_request('signin_queue',msg_payload,function(err,results){

            if(err)
            {
                throw err;
            }
            else
            {
                console.log("signin results"+results);
                console.log(results.host_id);
                if(results.code==200)
                {
                    //user identified successfully
                    req.session.user=username;              //user
                    req.session.userid=results.user_id;        //userid
                    req.session.fname=results.fname;
                    req.session.lname=results.lname;


                    if(results.host_id != undefined)
                        req.session.hostid=results.host_id;


                    json_respone = {
                        "statusCode": 200,
                        "user": username,

                    };
                    //should make a session
                    res.send(json_respone);

                }

                else
                {
                    json_respone={"statusCode":400};
                    res.send(json_respone);
                }
                console.log("user session id"+req.session.userid);
            }
        });

    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }


};
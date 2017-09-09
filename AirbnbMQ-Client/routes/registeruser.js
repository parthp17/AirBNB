var ejs=require("ejs");
var http=require("http");
var mq_client=require('../rpc/client');

exports.registeruser=function(req,res){



    try {

        console.log("inside registeruser.js ");
        var firstname=req.param("firstname");
        var lastname=req.param("lastname");
        var email=req.param("email");
        var password=req.param("password");

        var msg_payload={
            "firstname":firstname,
            "lastname":lastname,
            "email":email,
            "password":password
        };

        console.log(msg_payload);

        mq_client.make_request('registeruser_queue',msg_payload,function(err,results){

            if(err)
            {
                throw err;
            }
            else
            {
                console.log(results);
                if(results.code==200)
                {
                    json_response={"statusCode":200};
                    res.send(json_response);
                }
                else if(results.code==400)
                {
                    json_response={"statusCode":400};
                    res.send(json_response);
                }
                else
                {
                    json_response={"statusCode":400};
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

exports.adminrequest=function(req,res)
{



    try {

        console.log("inside admin request");

        var user_id=req.session.userid;

        var msg_payload={
            user_id:user_id
        };

        mq_client.make_request('makehost_queue',msg_payload,function(err,result){
            if(err)
            {
                console.log("1");
                json_response={statusCode:404};
                res.send(json_response);
            }
            else
            {
                console.log("2");
                json_response={statusCode:200};
                res.send(json_response);
            }
        })

    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }

};

exports.changepassword=function(req,res)
{


    try {

        console.log("inside changepassword");

        var user_id=req.session.userid;

        console.log(req.param("password"));
        var msg_payload={
            user_id:user_id,
            password:req.param("password")
        };

        mq_client.make_request('password_queue',msg_payload,function(err,results){
            if(err)
            {
                console.log("1");
                json_response={statusCode:404};
                res.send(json_response);
            }
            else
            {
                console.log(results);
                console.log("2");
                json_response={statusCode:200};
                res.send(json_response);
            }
        })

    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }



};
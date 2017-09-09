var ejs=require("ejs");
var http=require("http");
var mq_client = require('../rpc/client');

exports.myaccount=function(req,res){

    try {

        console.log("inside myaccount in account.js");

        var user_id=req.session.userid;

        var msg_payload={
            userid:user_id
        };

        mq_client.make_request('myaccount_queue',msg_payload,function (err,results) {
            console.log("results myaccount:"+results);
            console.log("host"+results.host);
            //console.log(results.length);
            if(err)
            {
                throw err;
            }
            else
            {
                if(results.host)
                {
                    var data={
                        host:results.host,
                        fname:results.fname,
                        lname:results.lname,
                        userid:results.userid,
                        hostid:results.hostid

                    };
                    console.log("result with no host"+data);
                    res.send(data);
                }
                else
                {
                    var data={
                        host:results.host,
                        fname:results.fname,
                        lname:results.lname,
                        userid:results.userid


                    };
                    console.log("result with  host"+data);
                    res.send(data);
                }
            }
        })

    }
    catch(e)
        {
           res.send({statusCode:417},{message:"Could not serve your request"});
        }

};

exports.deleteuser=function (req,res) {


    try{

        var userid=req.session.userid;

        var msg_payload={
            userid:userid
        };

        mq_client.make_request('deleteuser_queue',msg_payload,function(err,results){

            if(err)
            {
                throw err;
            }
            else
            {
                if(results.code==200)
                {
                    json_response={statusCode:200};
                    res.send(json_response);
                }
            }

        });


    }
    catch (e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }


};


exports.deletehost=function(req,res){


    try
    {
        var userid=req.session.userid;

        var msg_payload={
            userid:userid,
            hostid:req.session.hostid
        };

        mq_client.make_request('deletehost_queue',msg_payload,function(err,results){

            if(err)
            {
                throw err;
            }
            else
            {
                if(results.code==200)
                {
                    req.session.hostid=undefined;
                    json_response={statusCode:200};
                    res.send(json_response);
                }
            }

        });


    }
    catch(e)
    {
        res.send({statusCode:417},{message:"Could not serve your request"});

    }



};
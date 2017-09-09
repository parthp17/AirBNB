var ejs=require("ejs");
var http=require("http");

var mq_client = require('../rpc/client');

exports.genbills=function(req,res){


    try {

        console.log("inside fetchbills");

        var user=req.session.user;
        //var hostid=req.session.hostid;
        var userid=req.session.userid;

        var hostid=req.session.hostid;
        console.log(user,hostid,userid);

        var msg_payload={
            userid:userid,
            hostid:hostid
        };

        mq_client.make_request('genbills_queue',msg_payload,function(err,response){

            if(err)
            {
                console.log(err);
                throw err;
            }
            else
            {
                console.log(response);
                if(response.revenue==false)
                {
                    var data={
                        count1:response.count1,
                        count2:response.count2,
                        trips:response.trips,
                        revenue:false
                    };
                    res.send(data);
                }
                else  {

                    var data = {
                        count1:response.count1,
                        count2:response.count2,
                        revenue: response.revenue,
                        trips: response.trips
                    };

                    console.log(data);
                    res.send(data);
                }
            }

        });


    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }



};
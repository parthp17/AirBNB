var ejs=require("ejs");
var http=require("http");
var mq_client=require('../rpc/client');

exports.getreviews=function (req,res) {




    try {

        console.log("getreviews");

        var review={
            host_id:req.session.hostid,
            user_id:req.session.userid
        };

        mq_client.make_request('getreviews_queue',review, function(err,results) {
            console.log(results);
            if(err)
            {
                console.err("An error Occured.");
                res.send({"statusCode":404, "message":"An error Occured removing as property"});
            }
            else if(results.statusCode == 200)
            {
                var image = false;
                var reviewsByHost = false;
                var reviewsByUser = false;
                if(results.image!=undefined)
                {
                    image=new Buffer(results.image).toString('base64');
                }
                if(results.reviewsByHost!=undefined)
                {
                    reviewsByHost=results.reviewsByHost;
                }
                if(results.reviewsByUser!=undefined)
                {
                    reviewsByUser=results.reviewsByUser;
                }


                res.send({"statusCode":200, "image":image,"reviewsByHost":reviewsByHost,"reviewsByUser":reviewsByUser});//}
            }
            else
            {
                res.send({"statusCode":404, "message":"An error Occured loading notifications."});
            }
        });



    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }




};

exports.postuserreview=function(req,res)
{



    try {
        console.log("inside the postreview routes");
        //need to add user name and pass it here.
        //from session
        console.log(req.files);
        var reviewContent={

            user_id:req.session.userid,
            transaction_id:req.param("transaction_id"),
            host_id:req.param("host_id"),

            property_id:req.param("property_id"),
            property_title:req.param("property_title"),
            user_review:req.param("user_review"),
            user_ratings:req.param("user_ratings"),
            user_name:req.session.fname,


        };

        var reviewsMedia = {image:req.files};

        var review = {reviewContent:reviewContent,reviewsMedia:reviewsMedia};

        console.log(review);
        mq_client.make_request('userreviews_queue',review, function(err,results) {
            console.log(results.statusCode);
            if(err)
            {
                console.err("An error Occured.");
                res.send({"statusCode":404, "message":"An error Occured removing as property"});
            }
            else if(results.statusCode == 200)
            {
                console.log("1");
                res.send({"statusCode":200});
            }
            else
            {
                console.log("2");
                res.send({"statusCode":404, "message":"An error Occured loading notifications."});
            }
        });



    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }



};


exports.posthostreview=function (req,res) {



    try {

        console.log("inside posthostreview");

        var booking_id=req.param("booking_id");
        var user_id=req.param("user_id");
        var property_id=req.param("property_id");
        var user_review=req.param("user_review");
        var user_ratings=req.param("user_ratings");
        var transaction_id=req.param("transaction_id");

        console.log(transaction_id);

        var msg_payload={

            "host_id":req.session.hostid,
            "host_name":req.session.fname,
            "transaction_id":req.param("transaction_id"),
            "user_id":req.param("user_id"),
            "rating":req.param("user_ratings"),
            "review_content":req.param("user_review")
        };

        console.log(msg_payload);

        mq_client.make_request('posthostreview_queue',msg_payload,function(err,response){

            console.log(response);
            if(err)
            {
                console.log(err);
                json_response={statusCode:404};
                res.send(json_response);
            }
            else
            {
                if(response.statusCode==200)
                {
                    console.log("inside 200 response");
                    json_response={statusCode:200};
                    res.send(json_response);
                }
                else
                {
                    console.log(err);
                    json_response={statusCode:404};
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
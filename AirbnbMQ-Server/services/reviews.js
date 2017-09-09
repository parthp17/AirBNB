var ejs=require("ejs");
var http=require("http");
var mysql=require("./mysql");
var connect = require('./mysqlconnect1');
var mongoose = require('./mongoose');

exports.getreviews=function(req,msg,callback)
{


    try{
        console.log("inside getreviews");
        var res = {};
        var array = [];
        mongoose.user.find({"user_id":msg.user_id}, function(error,response){
            console.log("1");
            console.log(response);
            if(response.length > 0)
            {
                console.log("2");
                response[0].load().then(function(doc){
                    console.log("doc"+doc);
                    doc.loadSingleImage('profilePic.jpg').then(function(docs){
                        console.log("docs"+docs);
                        console.log("image buffer");
                        console.log(docs.attachments[0].buffer);
                        res.image= docs.attachments[0].buffer;
                        getReviewsByHost(msg,res,callback);
                    });
                });
            }
            else
            {
                getReviewsByHost(msg,res,callback);
            }

        });


    }
    catch(e)
    {
        var res={};

        res.statusCode=404;
        res.message="Server could not server the request";

        callback(null,res);
    }



    //mongoose.reviewByUser.find({"host_id": msg.host_id}, );
};




exports.postuserreviews=function(req,msg,callback)
{


    try{

        console.log(msg.reviewContent);
        var res = {};
        var reviewByUser = new mongoose.reviewByUser({
            user_id:msg.reviewContent.user_id,
            transaction_id:msg.reviewContent.transaction_id,
            host_id:msg.reviewContent.host_id,
            property_id:msg.reviewContent.property_id,
            property_title:msg.reviewContent.property_title,
            review_content:msg.reviewContent.user_review,
            rating:msg.reviewContent.user_ratings,
            user_name:msg.reviewContent.user_name
        });
        console.log(msg.reviewsMedia);
        if(msg.reviewsMedia.image.length != 0)
        {
            console.log(msg.reviewsMedia);
            reviewByUser.save(function(error,results)
            {
                if(error)
                {
                    res.statusCode = 404;
                    callback(req,res);
                }
                else
                {
                    res.statusCode = 200;
                    callback(req,res);
                }
            })

        }
        else
        {
            console.log("inside else of postusereview");
            reviewByUser.save(function(err,results){
                if(!err){
                    res.statusCode = 200;

                    callback(req,res);
                }
                else
                {
                    console.log(err);
                    res.statusCode = 404;

                    callback(req,res);
                }
            })
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


function postReviewByHost(req,msg,callback)					//host will give user reviews
{


    try{

        console.log("postReviewByHost in reviews.js");
        console.log(msg);
        var reviewByHost = new mongoose.reviewByHost(msg);
        var res = {};
        reviewByHost.save(function(err,result)
        {
            console.log(result);
            if(err)
            {
                console.log(err);
                res.statusCode = 404;
            }
            else
            {
                res.statusCode = 200;
                //res.review_id = results.insertId;
                callback(req,res);
            }
        });
    }
    catch(e)
    {
        var res={};

        res.statusCode=404;
        res.message="Server could not server the request";

        callback(null,res);
    }


}

function getReviewsByHost(msg,res,callback)
{

    try{
        console.log(res);
        var array=[];
        mongoose.reviewByHost.find({"user_id":msg.user_id}, function(err,docs) {
            console.log("3");
            if(docs.length > 0)
            {
                console.log("4");
                docs.forEach(function(doc) {
                    console.log("5");
                    var review = {
                        "transaction_id":doc.transaction_id,
                        "host_id":doc.host_id,
                        "user_id":doc.user_id,
                        "rating":doc.rating,
                        "review_content":doc.review_content,
                        "host_name":doc.host_name
                    };


                    array.push(review);
                    if(doc == docs[docs.length - 1])
                    {
                        console.log("6");
                        res.reviewsByHost = array;
                        getReviewsByUser(res,msg,callback);
                    }
                });

            }
            else
            {
                console.log("7");
                getReviewsByUser(res,msg,callback);
            }
        })

    }
    catch(e)
    {
        var res={};

        res.statusCode=404;
        res.message="Server could not server the request";

        callback(null,res);
    }


}
function  getReviewsByUser(res,msg,callback)
{


    try{
        console.log(res);
        console.log("8");
        var array1 = [];
        mongoose.reviewByUser.find({"host_id":msg.host_id}, function(err,docs) {
            console.log("9");
            if (docs.length > 0) {
                docs.forEach(function (doc) {
                    var reviews = {

                        "transaction_id": doc.transaction_id,
                        "host_id": doc.host_id,
                        "user_id": doc.user_id,
                        "rating": doc.rating,
                        "review_content": doc.review_content,
                        "property_id": doc.property_id,
                        "user_name": doc.user_name,
                        "property_tite": doc.property_title
                    };

                    array1.push(reviews);
                    if (doc == docs[docs.length - 1]) {
                        console.log("10");
                        res.statusCode = 200;
                        res.reviewsByUser = array1;
                        callback(null, res);
                    }
                });


            }
            else {
                console.log("11");
                res.statusCode = 200;
                callback(null, res);
            }
        });

    }
    catch(e)
    {
        var res={};

        res.statusCode=404;
        res.message="Server could not server the request";

        callback(null,res);
    }



}

exports.postReviewByHost =postReviewByHost;

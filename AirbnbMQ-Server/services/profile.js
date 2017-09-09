var ejs=require("ejs");
var http=require("http");
var mysql=require("./mysql");
var mongoose = require("./mongoose");

exports.userprofile=function (req,msg,callback) {


    try{

        console.log("inside profile.js");
        var res={};

        var user=msg.user;

        var query="select * from users where email='"+user+"'";
        mysql.fetchData(function(err,results){

            if(err)
            {
                throw err;
            }
            else
            {
                console.log(results);
                if(results.length>0)
                {
                    res={
                        data:results
                    };
                    callback(req,res);
                }
            }
        },query);


    }
    catch(e)
    {
        var res={};

        res.statusCode=404;
        res.message="Server could not server the request";

        callback(null,res);
    }



};

exports.updateprofile=function(req,msg,callback){


    try{

        console.log("inside the updateprofile");

        var fname=msg.fname;
        var lname=msg.lname;
        //var email=msg.email;
        //  var password=msg.password;
        var user_id=msg.user_id;
        var line1=msg.line1;
        var line2=msg.line2;
        var zipcode=msg.zipcode;
        var state=msg.state;
        var country=msg.country;
        var zipcode=msg.zipcode;
        var mobnum=msg.mobnum;
        var city=msg.city;
        var files = msg.files;

        console.log(files);

        var res={};

        var query="update users set fname='"+fname+"',lname='"+lname+"',phone_number='"+mobnum+"',address_line1='"+line1+"',address_liine2='"+line2+"',city='"+city+"',state='"+state+"',zipcode='"+zipcode+"',country='"+country+"' where user_id='"+user_id+"'";
        console.log(query);

        mysql.fetchData(function(err,results){
            console.log(results);
            if(err)
            {
                console.log(err);
                res.code=404;
                callback(req,res);
            }
            else
            {
                if(results.affectedRows>0 && files.length > 0)
                {
                    mongoose.user.find({"user_id":msg.user_id}, function(error,response){ console.log(response);
                        if(response.length > 0)
                        {
                            console.log("1");
                            response[0].load().then(function(doc){
                                doc.attachments[0].buffer = files[0].buffer;
                                doc.save();res.code=200;
                                callback(req,res);

                            });
                            /* response[0].updateImage('profilePic.jpg',files[0].buffer)
                             .then(function(doc){
                             console.log(" doc1 ");
                             doc.save();
                             res.code=200;
                             callback(req,res);
                             })*/
                        }
                        else
                        {console.log("user_id"+msg.user_id);
                            var user = new mongoose.user({
                                "user_id":msg.user_id
                            });
                            console.log("user");
                            console.log(user.user_id);
                            console.log(files[0].buffer);
                            user.addAttachment('profilePic.jpg', files[0].buffer)
                                .then(function(doc){
                                    console.log(" doc 2");
                                    doc.save();
                                    console.log(doc);
                                    res.code=200;
                                    callback(req,res);
                                })

                        }
                    })




                }
                else
                {
                    res.code=200;
                    callback(req,res);
                }
            }

        },query);

    }
    catch(e)
    {
        var res={};

        res.statusCode=404;
        res.message="Server could not server the request";

        callback(null,res);
    }




};
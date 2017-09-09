var ejs=require("ejs");
var http=require("http");
var mysql=require("./mysql");

exports.registeruser=function (req,msg,callback) {


    try{
        var res={};
        console.log("inside registeruser.js");
        console.log(msg);

        var firstname=msg.firstname;
        var lastname=msg.lastname;
        var email=msg.email;
        var password=msg.password;

        console.log(firstname);


        var activation=1;


        var adduser;

        var query="select * from users where email='"+msg.email+"'";
        adduser="INSERT INTO users(`fname`,`lname`,`email`,`password`,`activation`) VALUES ('"+msg.firstname+"','"+msg.lastname+"','"+msg.email+"',SHA('"+msg.password+"'),'"+activation+"')";

        console.log("adduser query"+adduser);


        mysql.fetchData(function(err,result){

            if(err)
            {
                throw err;
            }
            else
            {
                console.log(result.length);
                if(result.length>0)
                {
                    //duplicate user
                    res.code=400;
                    callback(req,res);
                }
                else
                {

                    mysql.fetchData(function(err,result1){

                        if(err)
                        {
                            throw err;
                        }
                        else
                        {
                            console.log(result1.affectedRows>0);
                            if(result1.affectedRows>0)
                            {
                                res.code=200;
                                callback(req,res);
                            }
                            else
                            {
                                //couldnt be added
                                res.code=404;
                                callback(req,res);


                            }
                        }

                    },adduser);



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

exports.makehost=function(req,msg,callback)
{


    try{
        console.log("make host");
        var user_id=msg.user_id;
        var activation="PENDING";

        var res={};

        var query1="select * from host where user_id='"+msg.user_id+"'";
        var query2="insert into host (`user_id`,`activation`) values('"+msg.user_id+"','"+activation+"')";

        mysql.fetchData(function(err,results){

            if(err)
            {
                console.log("err"+err);
                res.code=404;
                callback(req,res);
            }
            else
            {
                console.log(results);
                if(results.length>0)
                {
                    //update the paramter to pending

                    var query3="update host set activation='"+activation+"' where user_id='"+msg.user_id+"'";

                    mysql.fetchData(function(err,results2){

                        console.log("err"+err);
                        if(err)
                        {
                            console.log("err"+err);
                            res.code=404;
                            callback(req,res);

                        }
                        else
                        {

                            console.log("inside success of host id insert 1");
                            res.code=200;
                            callback(req,res);

                        }

                    },query3);

                }
                else
                {
                    //insert new field
                    mysql.fetchData(function (err,results1) {
                        console.log("err"+err);
                        if(err)
                        {
                            console.log("err"+err);
                            res.code=404;
                            callback(req,res);

                        }
                        else
                        {

                            console.log("inside success of host id insert 2");
                            res.code=200;
                            callback(req,res);

                        }
                    },query2);


                }

                //
                // console.log("inside success of host id insert");
                // res.code=200;
                // callback(req,res);
            }

        },query1);


    }
    catch(e)
    {
        var res={};

        res.statusCode=404;
        res.message="Server could not server the request";

        callback(null,res);
    }




};



exports.changepassword=function(req,msg,callback)
{


    try{
        var user_id=msg.user_id;
        console.log(msg.password);
        console.log(user_id);

        var res={};

        var query="update users set password= SHA1('"+ msg.password+"')where user_id='"+user_id+"'";
        console.log(query);

        mysql.fetchData(function(err,results){

            if(err)
            {
                console.log(err);
                res.statusCode=400;
                callback(req,res);
            }
            else
            {
                console.log(results);

                if(results.affectedRows>0)
                {
                    console.log("2");
                    res.statusCode=200;
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
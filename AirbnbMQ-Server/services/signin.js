var ejs=require("ejs");
var http=require("http");
var mysql=require("./mysql");

exports.signin=function(req,msg,callback){


    try{
        var res={};
        var userid;
        console.log("inside the signin.js");
        console.log("msg Q:"+msg);

        var username=msg.username;
        var password=msg.password;
        var activation=1;
        console.log(username);
        console.log(password);


        var getUser="select user_id,fname,lname from users where email='" + msg.username +"' and activation='"+activation+"' and password= SHA1('"+ msg.password+"')";
        console.log("Query is:"+getUser);

        mysql.fetchData(function(err,results){


            if(err)
            {
                throw err;
            }
            else
            {
                console.log("results");
                console.log(results);
                if(results.length>0)
                {

                    console.log("inside to get hostid");

                    var activation1="TRUE";
                    userid=results[0].user_id;
                    console.log(userid);

                    var query="select host_id from host where user_id='"+userid+"' and activation='"+activation1+"'";

                    mysql.fetchData(function(err,results1){

                        if(err)
                        {
                            console.log(err);
                            throw err;
                        }
                        else
                        {
                            console.log("results1");


                            if(results1.length>0)     //means host present?
                            {
                                console.log(results1[0].host_id);
                                console.log(results1[0].host_id);
                                user_id:results[0].user_id;

                                host_id:results1[0].host_id;
                                res={
                                    code: 200,
                                    host:true,
                                    user_id:results[0].user_id,
                                    host_id:results1[0].host_id,
                                    fname:results[0].fname,
                                    lname:results[0].lname,
                                };
                                callback(req,res);

                            }
                            else
                            {
                                res= {                          //host absent
                                    code: 200,
                                    host:false,
                                    user_id: results[0].user_id,
                                    fname:results[0].fname,
                                    lname:results[0].lname
                                };
                                callback(req,res);
                            }


                        }
                    },query);
                }
                else
                {
                    res.code=400;
                    console.log("user not authenticated");
                    callback(req,res);
                }
            }
        },getUser);


    }
    catch(e)
    {
        var res={};

        res.statusCode=404;
        res.message="Server could not server the request";

        callback(null,res);
    }




};

    exports.gethostid=function(req,msg,callback)
    {


        try{

            console.log("inside gethostid");
            var userid=msg.userid;
            var activation="TRUE";
            var res={};
            console.log(userid);

            var query="select host_id from host where user_id='"+userid+"' and activation='"+activation+"'";

            mysql.fetchData(function(err,results){

                if(err)
                {
                    console.log(err);
                    throw err;
                }
                else
                {
                    console.log("results");
                    console.log(results);

                    if(results.length>0)
                    {
                        console.log(results[0].host_id);

                        res.hostid=results[0].host_id;
                        callback(req,res);

                    }
                    else
                    {
                        res.hostid=undefined;
                        callback(req,res);
                    }
                    /*
                     console.log(results[0].host_id);

                     res.hostid=results[0].host_id;

                     callback(req,res);
                     */

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



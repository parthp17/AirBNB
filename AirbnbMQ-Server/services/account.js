var ejs=require("ejs");
var http=require("http");
var mysql=require("./mysql");

exports.myaccount=function(req,msg,callback){

    try{

        console.log("inside myaccount"+msg);
        var userid=msg.userid;
        var activation="TRUE";
        var res={};

        var query="select fname,lname from users where user_id='"+userid+"'";
        var query2="select host_id from host where user_id='"+userid+"' and activation='"+activation+"'";

        mysql.fetchData(function (err,results) {

            console.log("user details"+results[0].fname);
            console.log("user details"+results[0].lname);
            var fname=results[0].fname;
            var lname=results[0].lname;


            if(err)
            {
                throw err;
            }
            else
            {
                mysql.fetchData(function (err,result2) {


                    console.log(result2.length);

                    if(result2.length>0)
                    {
                        console.log("host id:"+result2[0].host_id);
                        res={
                            host:true,
                            fname:fname,
                            lname:lname,
                            userid:userid,
                            hostid:result2[0].host_id
                        };
                        callback(req,res);
                    }
                    else
                    {
                        res={
                            host:false,
                            fname:fname,
                            lname:lname,
                            userid:userid
                        };
                        callback(req,res);
                    }

                },query2);


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


exports.deleteaccount=function(req,msg,callback){



    try{
        console.log("deleteaccount in account.js");

        var userid=msg.userid;
        var activation=0;
        var res={};

        var query="update users set activation='"+activation+"' where user_id='"+userid+"'";

        mysql.fetchData(function(err,results){
            if(err)
            {
                throw err;
            }
            else {
                if (results.affectedRows > 0) {
                    res = {
                        code: 200
                    };

                    callback(req, res);
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



exports.deletehost=function(req,msg,callback){


    try{

        console.log("deletehost in account.js");

        var userid=msg.userid;
        var hostid=msg.hostid;
        var activation="FALSE";

        var res={};

        var query="update host set activation='"+activation+"' where user_id='"+userid+"'";

        mysql.fetchData(function(err,results){
            if(err)
            {
                throw err;
            }
            else {

                var query2="update properties set activation=0 where host_id='"+hostid+"'";
                mysql.fetchData(function(err,results2){
                    if (results.affectedRows > 0 || results2.affectedRows>0) {
                        res = {
                            code: 200
                        };

                        callback(req, res);
                    }

                },query2);

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
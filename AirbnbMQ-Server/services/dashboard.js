var ejs=require("ejs");
var http=require("http");
var mysql=require("./mysql");
var connect = require('./mysqlconnect1');
var dateformat=require('./DateTime');



exports.getdashboard=function(req,msg,callback)
{


    try{

        console.log("inside getdashboard");
        console.log("message"+msg.hostid);
        console.log(msg.hostid);
        console.log(msg.userid);

        var pending="pending";
        var approve="approve";

        var hide=0;

        //fetch user request approved by host
        var query = "select users.fname,users.lname,host.host_id,properties.title,properties.description,bookings.property_id,bookings.booking_id,bookings.start_date,bookings.status,bookings.end_date,bookings.total_price from bookings,properties,host,users where customer_id='"+msg.userid+"' and (status='pending' or status='approve') and end_date > now() and bookings.property_id=properties.property_id and properties.host_id=host.host_id and host.user_id=users.user_id and hide='"+hide+"' ;";
        console.log(query);

        var res = {};
        mysql.fetchData(function (err,results) {


            if (err) {
                res.statusCode = 404;
                callback(null, res);
            }
            else {

                if(msg.hostid!=undefined)
                {
                    //fetch pending request requested by user yet to be approved by host
                    var query2="select p.title, p.description,p.category_name, p.property_id,b.booking_id,b.total_price, b.start_date, b.end_date, u.fname, u.lname, u.user_id from properties p, bookings b, host h, users u where b.status ='"+pending+"'  and h.host_id='"+msg.hostid+"' and h.host_id=p.host_id and p.property_id=b.property_id  and b.customer_id = u.user_id";

                    mysql.fetchData(function (err2, results2) {

                        if(err2)
                        {
                            console.log(err2);
                            throw err2;
                        }
                        else
                        {

                            if(results.length>0)
                            {
                                if(results2.length>0)
                                {
                                    res = {
                                        code: 200,
                                        listing: results2,
                                        approvals: results
                                    };
                                }
                                else
                                {
                                    res = {
                                        code: 200,
                                        listing: false,
                                        approvals: results
                                    };
                                }

                            }
                            else
                            {
                                if(results2.length>0)
                                {
                                    res = {
                                        code: 200,
                                        listing: results2,
                                        approvals: false
                                    };
                                }
                                else
                                {
                                    res = {
                                        code: 200,
                                        listing: false,
                                        approvals: false
                                    };
                                }

                            }

                            console.log("res code" + res.code);
                            console.log("res");
                            console.log(res);
                            callback(req, res);

                        }

                    }, query2);
                }
                else
                {
                    if(results.length>0) {
                        console.log("1");
                        res = {
                            code: 200,
                            listing: false,
                            approvals: results
                        };
                        console.log("res" + res.code);
                        callback(req, res);
                    }
                    else
                    {
                        res = {
                            code: 200,
                            listing: false,
                            approvals: false
                        };
                        console.log("res" + res.code);
                        callback(req, res);
                    }

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



exports.hostapprove=function(req,msg,callback){



    try{

        var bid=msg.bid;
        var tdate=msg.transaction_date;

        console.log(bid);
        console.log("tdate"+tdate);

        var startdate=msg.sd;
        var enddate=msg.ed;


        startdate=dateformat.getdateFormat(startdate);
        enddate=dateformat.getdateFormat(enddate);

        console.log("startdate"+startdate);
        console.log("enddate"+enddate);

        var connection = mysql.getConnection();
        var res = {};
        var query1 = 'update bookings set status = ? where booking_id = ?;';

        var param1=["approve",msg.bid];
        connection.beginTransaction(function(err)
        {
            if(err)
            {
                res.statusCode = 404;
                callback(null,res);
            }
            connection.query(query1,param1,function (err1, results1){
                console.log("results1");
                console.log(results1);
                if(err1)
                {
                    connection.rollback(function() {
                        res.statusCode = 404;
                        callback(null,res);
                    });
                }
                else
                {
                    var query2 = 'insert into transaction set ?;';
                    var param2 = {"customer_id":msg.uid,"transaction_date":msg.transaction_date,"booking_id":msg.bid,"total_price":msg.tp};
                    connection.query(query2,param2,function (err2, results2){
                        console.log("results2");
                        console.log(results2);
                        if(err2)
                        {
                            console.log(err2);
                            connection.rollback(function() {
                                res.statusCode = 404;
                                callback(null,res);
                            });
                        }
                        else
                        {
                            var query3 = 'update bookings set status = ? where property_id = ? and booking_id != ? and ((start_date between ? and ?) or  (end_date between ? and ?));';
                            var param3 = ["decline",msg.pid,msg.bid,startdate,enddate,startdate,enddate];
                            connection.query(query3,param3,function (err3, results3){
                                console.log("results 3");
                                console.log(results3);
                                if(err3)
                                {
                                    console.log(err3);
                                    connection.rollback(function() {
                                        res.statusCode = 404;
                                        callback(null,res);
                                    });
                                }
                                else
                                {
                                    connection.commit(function(err4) {
                                        if (err4) {
                                            connection.rollback(function() {
                                                throw err;
                                            });
                                        }
                                        console.log('Transaction Completed.');
                                        //connect.returnConnection(connection);
                                        res.statusCode = 200;
                                        callback(req,res);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });


    }
    catch(e)
    {
        var res={};

        res.statusCode=404;
        res.message="Server could not server the request";

        callback(null,res);
    }



};


exports.hostdisapprove=function(req,msg,callback)
{



    try{

        console.log("inside hostdisapproce "+msg.bid);



        var query='update bookings set status = ? where booking_id = ?';
        var params=["declined",msg.bid];
        var res = {};

        var connection = mysql.getConnection();
        connection.query(query,params,function (err,rows) {

            if(err)
            {
                console.log(err);
                res.statusCode = 404;
                callback(null,res);
            }
            else
            {
                console.log(rows);
                //getBookings({"host_id":msg.host_id},callback);
                res.statusCode=200;
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


};


exports.hideapprovals=function(req,msg,callback)
{


    try{

        console.log("inside hide approvals");

        var hide=1;
        var query='update bookings set hide = ? where booking_id = ?';
        var params=[hide,msg.booking_id];
        var res={};
        console.log("1");


        connect.exec(query,params,function (err,rows) {
            console.log(err);
            console.log(rows);
            if(err)
            {
                console.log(err);
                res.statusCode=404;
                callback(req,res);
            }
            else
            {
                console.log(rows);
                //getBookings({"host_id":msg.host_id},callback);
                //data comes here

                console.log(msg.hostid);
                console.log(msg.userid);

                var pending="pending";
                var approve="approve";

                var hide=0;


                var query = "select users.fname,users.lname,host.host_id,properties.title,properties.description,bookings.property_id,bookings.booking_id,bookings.start_date,bookings.end_date,bookings.total_price from bookings,properties,host,users where status = '"+approve+"' and customer_id = '"+msg.userid+"' and hide = 0 and properties.property_id = bookings.property_id and properties.host_id=host.host_id and host.user_id=users.user_id and bookings.hide='"+hide+"' ;";
                console.log(query);

                var res = {};
                mysql.fetchData(function (err,results) {

                    if (err) {
                        res.statusCode = 404;
                        callback(null, res);
                    }
                    else {

                        if(msg.hostid!=undefined)
                        {
                            var query2="select p.title, p.description,p.category_name, p.property_id,b.booking_id,b.total_price, b.start_date, b.end_date, u.fname, u.lname, u.user_id from properties p, bookings b, host h, users u where b.status ='"+pending+"'  and p.property_id=b.property_id and h.host_id='"+msg.hostid+"' and b.customer_id = u.user_id";

                            mysql.fetchData(function (err2, results2) {

                                if(err2)
                                {
                                    console.log(err2);
                                    throw err2;
                                }
                                else if(results || results2) {
                                    console.log(results);       //those that are approved
                                    console.log(results2);   //those that need approval

                                    if(results.length>0)  //checking for approvals
                                    {
                                        res = {
                                            code: 200,
                                            listing: results2,
                                            approvals: results
                                        };
                                    }
                                    else                //there is no approvals
                                    {
                                        res = {
                                            code: 200,
                                            listing: results2,
                                            approvals: false
                                        };
                                    }

                                    console.log("res code" + res.code);
                                    console.log("res");
                                    console.log(res);
                                    callback(req, res);
                                    // }
                                    /*else
                                     {
                                     res={
                                     code:404
                                     };
                                     console.log("res"+res.code);
                                     callback(req,res);
                                     }
                                     */
                                }
                                else
                                {
                                    res={
                                        code:404
                                    };
                                    console.log("res"+res.code);
                                    callback(req,res);
                                }
                            }, query2);
                        }
                        else
                        {
                            if(results.length>0) {
                                res = {
                                    code: 200,
                                    listing: false,
                                    approvals: results
                                };
                                console.log("res" + res.code);
                                callback(req, res);
                            }
                            else
                            {
                                res = {
                                    code: 200,
                                    listing: false,
                                    approvals: false
                                };
                                console.log("res" + res.code);
                                callback(req, res);
                            }

                        }

                    }

                },query);


                /*
                 //on successfull data
                 res.statusCode=200;
                 callback(req,res);
                 */
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




};
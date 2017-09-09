var ejs=require("ejs");
var http=require("http");
var mysql=require("./mysql");

exports.genbills=function(req,msg,callback)
{


    try{

        console.log("inside gen bills");
        console.log(msg);
        console.log(msg.userid);
        console.log(msg.hostid);

        var approve="approve";

        var count1=false;
        var count2=false;

        //var hostid=2014;

        var res={};
        //host details--user bookings
        var query="select u.fname,u.lname,p.property_id,p.title,p.description,p.category_name,t.transaction_id,t.total_price,t.transaction_date,b.start_date,b.end_date,h.host_id from users u,properties p,transaction t,bookings b,host h where t.customer_id='"+msg.userid+"' and t.booking_id=b.booking_id and b.property_id=p.property_id and p.host_id=h.host_id and h.user_id=u.user_id";

        //user acts as host
        //var query2="select u.user_id,u.fname,u.lname,p.property_id,p.title,p.description,p.category_name,t.transaction_id,t.total_price,t.transaction_date,b.start_date,b.end_date from users u,properties p,transaction t,bookings b,host h where p.host_id='"+msg.hostid+"' and p.property_id=b.property_id and t.booking_id=b.booking_id and t.customer_id=u.user_id ";
        var query2= "select  u.user_id, u.fname, u.lname, p.property_id, p.title,p.description,p.category_name,b.booking_id,b.total_price,b.start_date,b.end_date,t.transaction_id from users u,properties p,bookings b,host h,transaction t where h.host_id='"+msg.hostid+"' and h.host_id=p.host_id and p.property_id=b.property_id and b.customer_id=u.user_id and b.status='"+approve+"' and b.booking_id=t.booking_id";

        mysql.fetchData(function (err,results) {

            if(err)
            {
                console.log(err);
                throw err;
            }
            else {
                console.log(results);
                if (msg.hostid != undefined) {
                    mysql.fetchData(function (err, results2) {

                        if (err) {
                            console.log(err);
                            throw err;
                        }
                        else {
                            console.log(results);

                            if(results.length>0)
                            {
                                count1=true;
                                if(results2.length>0)
                                {
                                    count2=true;
                                }
                            }
                            else
                            {
                                if(results2.length>0)
                                {
                                    count2=true;
                                }
                            }

                            res = {
                                "count1":count1,
                                "count2":count2,
                                "statusCode": 200,
                                "trips": results,
                                "revenue": results2

                            };
                            callback(req, res);
                        }
                    }, query2);
                }
                else {
                    if(results.length>0)
                    {
                        count1=true;

                    }
                    res = {
                        "count1":count1,
                        "count2":count2,
                        "statusCode": 200,
                        "trips": results,
                        "revenue": false
                    };
                    console.log(res);
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
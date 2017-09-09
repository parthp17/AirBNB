/**
 * Created by Vivek Agarwal on 11/10/2016.
 */
connect=require('./mysqlconnect1');
mongo=require('./mongo.js');
redis=require('./Redis');
var mongo = require("./mongo");

exports.getHostStat=function (msg,callback) {
    console.log("gethoststat");
    console.log(msg.pid);

    userlogs=mongo.collection('userlogs');
    res={};

    console.log("Inside Host Analysis with pid "+JSON.stringify(msg));

    userlogs.aggregate([{$match:{"property_id":Number(msg.pid)}},{"$group":{_id:"$timestamp",count:{$sum:1}}}]).toArray(function (err,answer) {
        if(!err) { //Exception Handled
            res.code=200;
            res.value=answer;
            console.log("Property Details as :"+JSON.stringify(res.value));
            callback(null,res);
        }
        else{
            console.log("Error from MongoDB for HOST analysis as :"+err);
            res.code=404;
            res.value={"result":"invalid"}
            callback(null,res);
        }
    });

}

exports.getBidTrace=function (msg,callback) {
    bidlogs=mongo.collection('biddinglogs');
    res={};

    bidlogs.find({"property_id":Number(msg.pid)}).toArray(function (err,answer) {
        if(!err) { //Exception Handled
            res.code=200;
            res.value=answer;
            console.log("Bidding Details as :"+JSON.stringify(res.value));
            callback(null,res);
        }
        else{
            console.log("Error from MongoDB for Bid Trace analysis as :"+err);
            res.code=404;
            res.value={"result":"invalid"}
            callback(null,res);
        }
    });

}

exports.getPropRatings=function (msg,callback) {

    userlogs=mongo.collection('userlogs');
    res={};

    console.log("Inside Property Ratings with pid "+JSON.stringify(msg));

    userlogs.aggregate([{$match:{"property_id":Number(msg.pid)}},{"$group":{_id:"$property_id",count:{$sum:1},avgQuantity: { $avg: "$user_id" }}}]).toArray(function (err,answer) {
        if(!err) { //Exception Handled
            res.code=200;
            res.value=answer;
            console.log("Property Details as :"+JSON.stringify(res.value));
            callback(null,res);
        }
        else{
            console.log("Error from MongoDB for HOST analysis as :"+err);
            res.code=404;
            res.value={"result":"invalid"}
            callback(null,res);
        }
    });

}


exports.getClicksPerPage=function (msg,callback) {
    userlogs=mongo.collection('userlogs');
    res={};


    userlogs.aggregate([{"$group":{_id:"$page",count:{$sum:1}}}]).toArray(function (err,answer) {

            if(!err) { //Exception Handled
                res.code=200;
                res.value=answer;
                callback(null,res);
            }
            else{
                res.code=404;
                res.value={"result":"invalid"}
                callback(null,res);
            }

    })
}

exports.getLessSeen=function(msg,callback){
    userlogs=mongo.collection('userlogs');
    res={};



    userlogs.aggregate([{"$group":{_id:"$page",count:{$sum:1}}},{$limit : 2 }]).toArray(function (err,answer) {
        if(!err) { //Exception Handled
            console.log("Inside Least Seen with :"+JSON.stringify(answer));
            res.code=200;
            res.value=answer;
            callback(null,res);
        }
        else{
            res.code=404;
            res.value={"result":"invalid"}
            callback(null,res);
        }

    });

}

exports.userTrace=function (msg,callback) {
    userlogs=mongo.collection('userlogs');
    res={};

    console.log("Inside user log trace with uid :"+msg.name+ " with type :"+typeof msg.name);

    userlogs.find({"user_id":Number(msg.name)},function (err,cursor) {

        cursor.toArray(function (err,answer) {
            if(!err) { //Exception Handled
                res.code=200;
                res.value=answer;
                console.log("Answer :"+JSON.stringify(answer));
                callback(null,res);
            }

            else{
                res.code=404;
                res.value={"result":"invalid"}
                callback(null,res);
            }
        })
    })

}

exports.validate=function(msg,callback){
    var query='select password from admin where username=?;';
    var params=[msg.username];
    res={};
    connect.exec(query,params,function (rows) {
        console.log("rows :"+JSON.stringify(rows));
        console.log(rows);
        console
        if(rows!=undefined){
            if(rows[0].password==msg.password){
                console.log("Admin Auth Successful!")
                res.code=200;
                res.value={"result":"success"}
                callback(null,res);
            }
            else{
                res.code=401;
                res.value={"result":"invalid"}
                callback(null,res);
            }
        }
        else{
            res.code=404;
            res.value={"result":"failure"}
            callback(null,res);
        }

    })
}

exports.approval=function (msg,callback) {

    var query='update host set activation = ? where host_id=?;'
    var params=[msg.approval,msg.host_id];
    console.log("approval dec :"+msg.approval+" host :"+msg.host_id);
    res={};

    connect.exec("select * from users,host where users.user_id=host.user_id and host.host_id=?",[msg.host_id],function (userrows) {

            connect.exec(query,params,function (err,rows) {
                if(rows!=undefined){
                    redis.delete(userrows[0].city,function (err,success) {
                        console.log("Deleted redis key "+userrows[0].city +" as "+success);
                    });
                    res.value=rows;
                    res.code=200;
                    callback(null,res);
                }
                else{
                    res.code=401;
                    res.value={"result":"failure"}
                    callback(null,res);
                }
            });

    })

}

exports.topProperties=function(msg,callback){
    var query='select trendings.count,properties.property_id, properties.price, properties.host_id, properties.title, properties.description, properties.category_name, properties.line1, properties.line2, properties.city, properties.state, properties.zipcode, properties.country from properties inner join trendings on properties.property_id=trendings.property_id order by trendings.count DESC;'

    res={};
    connect.exec(query,[],function (rows) {
        if(rows!=undefined){
            res.value=rows;
            res.code=200;
            callback(null,res);
        }
        else{
            res.code=401;
            res.value={"result":"failure"}
            callback(null,res);
        }
    })

}


exports.topHosts=function (msg,callback) {
    var query='select Count(properties.property_id) as count, properties.host_id from properties,bookings where properties.property_id=bookings.property_id group by host_id ORDER BY COUNT(bookings.property_id)	 DESC LIMIT 10 ;'

    res={};
    connect.exec(query,[],function (rows) {
        if(rows!=undefined){
            res.value=rows;
            res.code=200;
            callback(null,res);
        }
        else{
            res.code=401;
            res.value={"result":"failure"}
            callback(null,res);
        }
    })
}

exports.getBills=function (msg,callback) {

    console.log("Type Got As :"+msg.type);
    var res={};

    if(msg.type=="date"){
        var query = 'select * from users,bookings,transaction,properties where bookings.booking_id=transaction.booking_id and bookings.property_id=properties.property_id and bookings.customer_id=users.user_id and DATE(transaction.transaction_date) between ? and ?;';
        var params=[msg.start,msg.end];

        connect.exec(query,params,function (rows) {
            if(rows!=undefined){
                res.value=rows;
                res.code=200;
                callback(null,res);
            }
            else{
                res.code=401;
                res.value={"result":"failure"}
                callback(null,res);
            }
        });

    }

    if(msg.type=="id"){
        var query='select * from users,bookings,transaction,properties where bookings.booking_id=transaction.booking_id and bookings.property_id=properties.property_id and bookings.customer_id=users.user_id and bookings.booking_id=?;';
        var params=[msg.id];
        connect.exec(query,params,function (rows) {
            if(rows!=undefined){
                res.value=rows;
                res.code=200;
                callback(null,res);
            }
            else{
                res.code=401;
                res.value={"result":"failure"}
                callback(null,res);
            }
        });
    }

    if(msg.type='all'){

        var query='select * from users,bookings,transaction,properties where bookings.booking_id=transaction.booking_id and bookings.property_id=properties.property_id and bookings.customer_id=users.user_id;';
        var params=[];

        connect.exec(query,params,function (rows) {
            if(rows!=undefined){
                res.value=rows;
                res.code=200;
                callback(null,res);
            }
            else{
                res.code=401;
                res.value={"result":"failure"}
                callback(null,res);
            }
        });

    }



}

exports.cityRevenue=function(msg,callback){
    var query='select city, sum(city_revenue) as revenue from citybasedrevenew group by city;'

    res={};
    connect.exec(query,[],function (rows) {
        if(rows!=undefined){
            res.value=rows;
            res.code=200;
            callback(null,res);
        }
        else{
            res.code=401;
            res.value={"result":"failure"}
            callback(null,res);
        }
    })

}

exports.getPending=function (msg,callback) {
    var query='select users.user_id, users.fname, users.lname, users.email, users.phone_number, users.address_line1,users.address_liine2,users.city,users.zipcode,users.country,host.host_id, host.activation from users,host where users.user_id=host.user_id;'; //and host.activation="PENDING";
    var params=[];
    var res={};

    connect.exec(query,params,function (rows) {
        if(rows!=undefined){
            res.value=rows;
            res.code=200;
            callback(null,res);
        }
        else{
            res.code=401;
            res.value={"result":"failure"}
            callback(null,res);
        }
    });

}

exports.register=function (msg,callback) {
    var query='select admin_id from admin order by admin_id desc limit 1;';
    var params=[];
    var res={};

    connect.exec(query,params,function (rows) {
        if(rows!=undefined){
            lastid=Number(rows[0].admin_id.replace(/-/g,''));
            console.log("last admin_id :"+ (lastid));
            lastid=lastid+1;


            var split=lastid.toString().match(/.{1,3}/g);
            var newID="";
            for(var i=0;i<split.length-1;i++){
                newID=newID+split[i]+"-";
            }
            newID=newID+split[split.length-1];

            console.log("New Admin Id :"+newID);

            query='Insert into admin(admin_id,fname,lname,username,password) values (?,?,?,?,?);';
            params=[newID,msg.fname,msg.lname,msg.username,msg.password];
            connect.exec(query,params,function (err,rows) {
                if(rows!=undefined){
                    res.code=200;
                    res.value={"result":"success"}
                    callback(null,res);
                }
                else{
                    res.code=401;
                    res.value={"result":"invalid"}
                    callback(null,res);
                }
            })
        }
        else{
            res.code=401;
            res.value={"result":"failure"}
            callback(null,res);
        }
    })

}

exports.getHosts=function (msg,callback) {
    var query='select host.host_id,host.activation,users.fname,users.lname,users.email,users.address_line1,users.address_liine2,users.city,users.state,users.zipcode,users.country from host,users where host.user_id=users.user_id and users.city=? and host.activation="TRUE"';
    var params=[msg.city];
    var res={};
    //
    // redis.delete(msg.city,function (err,reply) {
    //     console.log("Deleted as :"+reply);
    // })

    redis.fetch(msg.city,function (err,reply) {
        console.log("Found redis reply as :"+JSON.stringify(reply)+" with type :"+typeof reply+" typeof city :"+typeof msg.city);

        if(!err){
            if(reply.length!=0){
                res.code=200;
                res.value=reply;
                callback(null,res);
            }
            else{
                connect.exec(query,params,function (rows) {
                    if(rows!=undefined){
                        res.code=200;
                        res.value=rows;
                        redis.store(msg.city,rows,function (err,reply) {
                            if(!err){
                                callback(null,res);
                            }
                            else
                                throw err;
                        })

                    }
                    else{
                        res.code=401;
                        res.value={"result":"invalid"}
                        callback(null,res);
                    }
                });
            }
        }
    })



}


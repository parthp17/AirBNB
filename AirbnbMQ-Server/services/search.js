var mongoose = require('./mongoose');
var connect = require('./mysqlconnect');
var mongo = require('./mongo');
// retrieves searched data
exports.handle_search = function (msg, callback) {


    try{
        var query = 'select distinct properties.property_id, properties.title, properties.description, properties.price, properties.category_name, properties.latitude, properties.longitude from properties,bookings where properties.city=? and properties.available_from<= ? and properties.available_to>= ? and properties.capacity>=? and properties.activation=1 and ? not between bookings.start_date and bookings.end_date and ? not between bookings.start_date and bookings.end_date;'
        var params=[msg.where, msg.checkin, msg.checkout,msg.guests,msg.checkin,msg.checkout];
        res = {};
        connect.exec(query, params, function (rows) {
            console.log("Got properites based on search", rows);
            if (rows) {
                console.log("search Successful!");

                var array = [];
                rows.forEach(function(row){
                    mongoose.property.findOne({"property_id":row.property_id},function(error,response){
                        if(error)
                        {
                            console.log(error);
                            res.code=404;
                            //res.value={"result":"success", "data":rows};
                            callback(null,res);

                        }
                        else if(response != null)
                        {
                            array.push(response);
                            if(row == rows[rows.length - 1])
                            {
                                res.array = array;
                                res.code=200;
                                res.value={"result":"success", "data":rows};
                                callback(null,res);
                            }
                        }
                        else
                        {
                            array.push(response);
                            if(row == rows[rows.length - 1])
                            {
                                res.code=200;
                                res.array = array;
                                res.value={"result":"success", "data":rows};
                                callback(null,res);
                            }
                        }
                    });
                });

            }
            else {
                console.log("search Fail!");
                res.code = 401;
                res.value={"result":"invalid"};
                callback(null,res);
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



};
exports.userTrace = function(msg,callback){
    // var query='select properties.property_id from properties,bookings where properties.property_id=? and properties.available_from<= ? and properties.available_to>= ? and properties.capacity>=? and properties.activation=1 and ? not between bookings.start_date and bookings.end_date and ? not between bookings.start_date and bookings.end_date;';
    // var params=[msg.property_id, msg.checkin, msg.checkout, msg.guests, msg.checkin, msg.checkout ];
    // res={};
    console.log(msg.property_click_json);
    userlogs=mongo.collection('userlogs');
    res={};

    userlogs.save(msg.property_click_json,function (err,answer) {
        if(!err) { //Exception Handled
            res.code=200;
            res.value=answer;
            console.log("userlogs res:" +answer);
            callback(null,res);
        }
        else{
            console.log("Error from MongoDB for Bid Trace analysis as :"+err);
            res.code=401;
            res.value={"result":"invalid"}
            callback(null,res);
        }
    });

}
exports.handle_filter = function (msg, callback) {


    try{
        var query = 'select distinct properties.property_id, properties.title, properties.description, properties.price, properties.category_name, properties.latitude, properties.longitude from airbnb.properties,airbnb.bookings where properties.city=? and properties.price between ? and ? and properties.available_from<= ? and properties.available_to>= ? and properties.capacity>= ? and properties.activation=1 and properties.category_name in (?, ? ,? , ?) and ? not between bookings.start_date and bookings.end_date and ? not between bookings.start_date and bookings.end_date;'
        // var params=[msg.where, msg.checkin, msg.checkout];
        var params=[msg.where, msg.minValue, msg.maxValue, msg.checkin, msg.checkout, msg.guests, msg.home, msg.apartment, msg.villa, msg.castle, msg.checkin, msg.checkout];
        res = {};
        connect.exec(query, params, function (rows) {
            console.log("Got filtered properites", rows);
            if (rows.length>0) {
                console.log("filter Successful!");
                var array = [];
                rows.forEach(function(row){
                    mongoose.property.findOne({"property_id":row.property_id},function(error,response){
                        if(error)
                        {
                            console.log(error);
                            res.code=401;
                            //res.value={"result":"success", "data":rows};
                            callback(null,res);

                        }
                        else if(response != null)
                        {
                            array.push(response);
                            if(row == rows[rows.length - 1])
                            {
                                res.array = array;
                                res.code=200;
                                res.value={"result":"success", "data":rows};
                                callback(null,res);
                            }
                        }
                        else
                        {
                            array.push(response);
                            if(row == rows[rows.length - 1])
                            {
                                res.code=200;
                                res.array = array;
                                res.value={"result":"success", "data":rows};
                                callback(null,res);
                            }
                        }
                    });
                });

            }
            else {
                console.log("filter Fail!");
                res.code = 200;
                res.value={"result":"success", };
                callback(null,res);
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


};
// exports.validate=function(msg,callback){
//     var query='select password from admin where username=?;';
//     var params=[msg.username];
//     res={};
//     connect.exec(query,params,function (rows) {
//         if(rows!=undefined){
//             if(rows[0].password==msg.password){
//                 console.log("Admin Auth Successful!")
//                 res.code=200;
//                 res.value={"result":"success"}
//                 callback(null,res);
//             }
//             else{
//                 res.code=401;
//                 res.value={"result":"invalid"}
//                 callback(null,res);
//             }
//         }
//         else{
//             res.code=404;
//             res.value={"result":"failure"}
//             callback(null,res);
//         }

//     })
// }
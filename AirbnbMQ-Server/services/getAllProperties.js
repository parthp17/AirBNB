var connect = require('./mysqlconnect');
var mongoose = require('./mongoose');
// retrieves all property data
exports.handle_search = function (msg, callback) {



    try{

        var query = 'select * from airbnb.properties where activation = 1 order by property_id desc limit 6';
        // var params=[msg.where, msg.checkin, msg.checkout];
        var params=[];
        res = {};
        connect.exec(query, params, function (rows) {
            console.log("Got properites", rows);
            if (rows) {
                console.log("getAllProperties Successful!");
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
                console.log("getAllProperties Fail!");
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


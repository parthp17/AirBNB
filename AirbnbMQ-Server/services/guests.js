
connect=require('./mysqlconnect');
var mongoose = require('./mongoose');

exports.property = function(msg,callback){


    try{
        console.log("in property");
        var query='select * from properties where property_id=?';
        var params=[msg.property_id];
        res={};
        connect.exec(query,params,function (rows) {

            console.log("in property service");
            console.log(rows);
            if(rows!=undefined){

                if(rows[0].is_bidding) {
                    var query='SELECT * FROM airbnb.bids, airbnb.auction, airbnb.users where auction.auction_id = bids.auction_id and bids.bidder_id = users.user_id  and auction.property_id = ? order by bids.bid_price desc limit 5';
                    var params=[msg.property_id];
                    res={};
                    connect.exec(query,params,function (answer) {

                        console.log("in bid service");
                        console.log(answer);

                        if(answer.length>0){
                            console.log("bidder name: " + answer[0].fname);
                            console.log(answer[1].fname);

                            console.log("8");

                            var array1 = [];
                            console.log("here");
                            mongoose.reviewByUser.find({"property_id":msg.property_id}, function(err,docs) {
                                if(err)
                                {
                                    console.log(err);
                                }
                                console.log("9");
                                console.log(docs.length);
                                console.log(docs);
                                if (docs.length > 0) {
                                    docs.forEach(function (doc) {

                                        console.log(doc);
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
                                        console.log(array1);
                                        if (doc == docs[docs.length - 1]) {
                                            console.log("10");
                                            res.code = 200;
                                            res.value=rows;
                                            res.bid=answer;
                                            res.reviewsByUser = array1;
                                            callback(null, res);
                                        }
                                    });


                                }
                                else {
                                    console.log("11");
                                    res.code = 200;
                                    res.value=rows;
                                    res.bid=answer;
                                    callback(null, res);
                                }
                            });



                        }
                        else{
                            res.code=404;
                            res.value={"result":"failure"}
                            res.bid={"result":"failure"}
                            callback(null,res);
                        }

                    })
                }
                else{


                    var array1 = [];
                    console.log("no_bid");
                    mongoose.reviewByUser.find({"property_id" : msg.property_id}, function(err,docs) {
                        if(err) {
                            console.log(err);
                        }
                        console.log("9");
                        console.log(docs);
                        console.log(docs.length);

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
                                    res.code = 200;
                                    res.value = rows;
                                    res.reviewsByUser = array1;
                                    callback(null, res);
                                }
                            });


                        }
                        else {
                            console.log("11");
                            res.code = 200;
                            res.value = rows;
                            callback(null, res);
                        }
                    });

                }

            }
            else{
                res.code=404;
                res.value={"result":"failure"}
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


}


exports.handle_request = function(msg,callback){



    try{

        var query='select capacity from properties where property_id=?;';
        var params=[msg.property_id];
        res={};
        connect.exec(query,params,function (rows) {

            console.log("in handle_request");
            console.log("maximum numberof guests allowed: " + rows[0].capacity);
            if(rows!=undefined){
                if(rows[0].capacity>=msg.number){
                    console.log("guests number valid");
                    res.code=200;
                    res.value={"result":"success"};
                    callback(null,res);
                }
                else{
                    res.code=401;
                    res.value={"result":"invalid", "valid_num":rows[0].capacity};
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
    catch(e)
    {
        var res={};

        res.statusCode=404;
        res.message="Server could not server the request";

        callback(null,res);
    }


}

exports.change = function(msg,callback){


    try{

        var query='select properties.property_id from properties,bookings where properties.property_id=? and properties.available_from<= ? and properties.available_to>= ? and properties.capacity>=? and properties.activation=1 and ? not between bookings.start_date and bookings.end_date and ? not between bookings.start_date and bookings.end_date;';
        var params=[msg.property_id, msg.checkin, msg.checkout, msg.guests, msg.checkin, msg.checkout ];
        res={};
        connect.exec(query,params,function (rows) {

            console.log("in change");

            if(rows!=undefined){
                console.log("got pricing");
                res.code=200;
                res.value={"result":"success"};
                callback(null,res);
            }
            else{
                res.code=404;
                res.value={"result":"failure"}
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


}

exports.handle_req = function(msg,callback){


    try{

        var query='select price from properties where property_id=?;';
        var params=[msg.property_id];
        res={};
        connect.exec(query,params,function (rows) {

            console.log("in handle_req");

            if(rows!=undefined){
                console.log("got pricing");
                res.code=200;
                res.value={"result":"success", "price":rows[0].price};
                callback(null,res);
            }
            else{
                res.code=404;
                res.value={"result":"failure"}
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


}


exports.add = function(msg,callback){


    try{

        var query='update users set card=?, month=?, year=? where user_id=100000002;';
        var params=[msg.enumber,msg.emonth,msg.eyear];
        res={};
        connect.exec(query,params,function (rows) {

            console.log("in add_req");

            if(rows!=undefined){
                console.log("got pricing");
                res.code=200;
                res.value={"result":"success"};
                callback(null,res);
            }
            else{
                res.code=404;
                res.value={"result":"failure"}
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




}


exports.load = function(msg,callback){



    try{

        console.log("in loads");
        var query='select * from users where user_id=?;';
        var params=[msg.user_id];
        res={};
        connect.exec(query,params,function (rows) {

            console.log("in load");

            if(rows!=undefined){
                console.log("got user details");
                console.log(rows[0].year);
                res.code=200;
                res.value=rows;
                callback(null,res);
            }
            else{
                res.code=404;
                res.value={"result":"failure"}
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


}

exports.handle_bid = function(msg,callback){



    try{
        console.log("in loads");
        var query='select auction_id from auction where property_id=?;';
        var params=[msg.property_id];
        res={};
        connect.exec(query,params,function (rows) {

            console.log("in bid");

            if(rows!=undefined){
                console.log("auction_id:" + rows[0].auction_id);

                var query='insert into bids (auction_id, bid_price, bid_date, bidder_id) values(?,?,?,?)';
                var params=[rows[0].auction_id, msg.bid, msg.date, 100000007];
                res={};
                connect.exec(query,params,function (rows) {

                    console.log("in biddd");

                    if(rows==null){
                        console.log("entered bid");
                        res.code=200;
                        res.value=rows;
                        callback(null,res);
                    }
                    else{
                        res.code=404;
                        res.value={"result":"failure"}
                        callback(null,res);
                    }

                })


                // console.log(rows[0].year);
                res.code=200;
                res.value=rows;
                callback(null,res);
            }
            else{
                res.code=404;
                res.value={"result":"failure"}
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


}

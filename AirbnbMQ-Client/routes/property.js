"use strict";
var mq_client = require('../rpc/client');
var ejs = require("ejs");
//var logging = require('./logging');
var dateTime = require('./DateTime');
var auction = require('./auction');
var geocoder = require('geocoder');
var fs = require("fs");

function getListings(req,res){
    res.render("HostListings.ejs");
}

function layoutProperty(req,res){
    res.render("PropertyLayout.ejs");
}

function addProperty(req,res){



    try {

        geocoder.geocode(req.param("line1") +","+ req.param("city")+","+ req.param("state")+","+ req.param("country"),function ( err, data ) {

            var latitude = data.results[0].geometry.location.lat;

            var longitude = data.results[0].geometry.location.lng;
            var propertyDetails = {
                "host_id":req.session.hostid,
                "category_name":req.param("category_name"),
                "bedrooms":req.param("bedrooms"),
                "capacity":req.param("capacity"),
                "bathrooms":req.param("bathrooms"),
                "title":req.param("title"),
                "description":req.param("description"),
                "available_from":req.param("available_from"),
                "available_to":req.param("available_to"),
                "is_bidding":req.param("is_bidding"),
                "price":req.param("price"),
                "line1":req.param("line1"),
                "line2":req.param("line2"),
                "city":req.param("city"),
                "state":req.param("state"),
                "country":req.param("country"),
                "zipcode":req.param("zipcode"),
                "activation":1,
                "latitude":latitude,
                "longitude":longitude

            };

            var propertyMedia = {

                "image":req.files[0].originalname,
                "video":req.files[1].originalname

            };
            console.log(req.files);
            var startTime;
            var endTime;
            if(req.param("is_bidding"))
            {
                startTime = dateTime.getCurrentDateTime();
                endTime = dateTime.getAuctionDateTime();

            }
            fs.writeFile("./AirbnbMQ-Client/public/images/"+req.files[0].originalname, req.files[0].buffer, function(err) {
                if(err) {
                    return console.log(err);
                }
                fs.writeFile("./AirbnbMQ-Client/public/images/"+req.files[1].originalname, req.files[1].buffer, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                    var property = {"propertyDetails":propertyDetails,"propertyMedia":propertyMedia};
                    mq_client.make_request('addProperty',property, function(err,results) {
                        if(err)
                        {
                            console.err("An error Occured.");
                            res.send({"statusCode":404, "message":"An error Occured removing as a host"});
                        }
                        else if(results.statusCode == 200)
                        {console.log("1");
                            if(req.param("is_bidding"))
                            {console.log("2");
                                var auctionDetails = {"property_id":results.property_id,"start_date":startTime,"end_date":endTime};
                                console.log(auctionDetails);
                                mq_client.make_request('addToAuction',auctionDetails, function(err1,results1) {
                                    if(err1)
                                    {console.log("4");
                                        console.err("An error Occured.");
                                        res.send({"statusCode":404, "message":"An error Occured auctioning"});
                                    }
                                    else if(results1.statusCode == 200)
                                    {console.log("5");
                                        auction.startAuctions(results1.auction, function(json){
                                            res.send(json);
                                        });
                                    }
                                    else
                                    {console.log("6");
                                        res.send({"statusCode":404, "message":"An error Occured auctioning"});
                                    }
                                });
                            }
                            else
                            {console.log("7");
                                res.send({"statusCode":200});
                            }

                        }
                        else
                        {console.log("8");
                            res.send({"statusCode":404, "message":"An error Occured adding a property"});
                        }
                    });
                });
                console.log("The file was saved!");
            });
        });


    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }




}

exports.addProperty=addProperty;
function updateProperty(req,res){


    try {

        var updatePropertyDetails = {
            "host_id":req.session.hostid,
            "bedrooms":req.param("bedrooms"),
            "capacity":req.param("capacity"),
            "bathrooms":req.param("bathrooms"),
            "title":req.param("title"),
            "description":req.param("description"),
            "available_from":req.param("available_from"),
            "available_to":req.param("available_to"),
            "is_bidding":req.param("is_bidding"),
            "price":req.param("price")
        };
        var updatePropertyMedia ;
        if(req.files[0] != undefined || req.files[1] != undefined)
        {
            updatePropertyMedia = {
                "image":req.files[0].originalname,
                "video":req.files[1].originalname
            };
            fs.writeFile("./AirbnbMQ-Client/public/images/"+req.files[0].originalname, req.files[0].buffer, function(err) {
                if(err) {
                    return console.log(err);
                }
                fs.writeFile("./AirbnbMQ-Client/public/images/"+req.files[1].originalname, req.files[1].buffer, function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    var updatedProperty = {"property_id":req.param("property_id"),"updatePropertyDetails":updatePropertyDetails,"updatePropertyMedia":updatePropertyMedia};
                    mq_client.make_request('updateProperty',updatedProperty, function(err,results) {
                        if(err)
                        {
                            console.err("An error Occured.");
                            res.send({"statusCode":404, "message":"An error Occured updating property"});
                        }
                        else if(results.statusCode == 200)
                        {
                            console.log("1");
                            console.log(req.param("is_bidding"));
                            if(req.param("is_bidding") != 0)
                            {
                                console.log("2");

                                auction.terminateAuction({"property_id":results.property.property_id});

                                var auctionDetails = {"property_id":req.param("property_id"),"start_time":dateTime.getCurrentDateTime(),"end_time":dateTime.getAuctionDateTime()};
                                mq_client.make_request('addToAuction',auctionDetails, function(err1,results1) {
                                    if(err1)
                                    {console.log("4");
                                        console.err("An error Occured.");
                                        res.send({"statusCode":404, "message":"An error Occured auctioning"});
                                    }
                                    else if(results1.statusCode == 200)
                                    {console.log("3");
                                        auction.startAuctions(results1.auction, function(json){
                                            res.send(json);
                                        });
                                    }
                                    else
                                    {console.log("5");
                                        res.send({"statusCode":404, "message":"An error Occured auctioning"});
                                    }
                                });
                            }
                            else
                            {   console.log("6");
                                res.send({"statusCode":200, "property":results.property});
                            }
                        }
                        else
                        {
                            res.send({"statusCode":404, "message":"An error Occured loading notifications."});
                        }
                    });


                });
            });
        }
        else
        {
            var updatedProperty = {"property_id":req.param("property_id"),"updatePropertyDetails":updatePropertyDetails,"updatePropertyMedia":updatePropertyMedia};
            mq_client.make_request('updateProperty',updatedProperty, function(err,results) {
                if(err)
                {
                    console.err("An error Occured.");
                    res.send({"statusCode":404, "message":"An error Occured updating property"});
                }
                else if(results.statusCode == 200)
                {
                    console.log("1");
                    console.log(req.param("is_bidding"));
                    if(req.param("is_bidding") != 0)
                    {
                        console.log("2");
                        auction.terminateAuction({"property_id":results.property.property_id});

                        var auctionDetails = {"property_id":req.param("property_id"),"start_time":dateTime.getCurrentDateTime(),"end_time":dateTime.getAuctionDateTime()};
                        mq_client.make_request('addToAuction',auctionDetails, function(err1,results1) {
                            if(err1)
                            {console.log("4");
                                console.err("An error Occured.");
                                res.send({"statusCode":404, "message":"An error Occured auctioning"});
                            }
                            else if(results1.statusCode == 200)
                            {console.log("3");
                                auction.startAuctions(results1.auction, function(json){
                                    res.send(json);
                                });
                            }
                            else
                            {console.log("5");
                                res.send({"statusCode":404, "message":"An error Occured auctioning"});
                            }
                        });
                    }
                    else
                    {   console.log("6");
                        res.send({"statusCode":200, "property":results.property});
                    }
                }
                else
                {
                    res.send({"statusCode":404, "message":"An error Occured loading notifications."});
                }
            });


        }

    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }


}

exports.updateProperty = updateProperty;

exports.editlistingpage=function(req,res)
{



    try {

        var property_id=req.param("pid");
        console.log("propertyid"+req.param("pid"));

        mq_client.make_request('getPropertyDetails',{"property_id":property_id}, function(err,results) {
            console.log("results"+results);
            console.log(results.property.city);
            if(err)
            {
                console.err("An error Occured.");
                res.send({"statusCode":404, "message":"An error Occured removing as a host"});
            }
            else if(results.statusCode == 200)
            {

                console.log("inside ejs");
                /*results.property.available_from = getdateFormatForProperty(results.property.available_from);
                 results.property.available_to = getdateFormat(results.property.available_to);
                 */
                res.render('edit_listing.ejs',
                    {"statusCode":200,"city":results.property.city,"property":results.property});

                /*
                 ejs.renderFile('./AirbnbMQ-Client/views/edit_listing.ejs',
                 {"statusCode":200,"city":results.property.city,"property":results.property},
                 function(error,results){
                 if(!error){
                 res.send(results);
                 res.end();
                 }
                 else
                 {
                 res.end("Error!");
                 console.log(error);
                 }
                 });  */

            }
            else
            {
                res.send({"statusCode":404, "message":"An error Occured loading notifications."});
            }
        });



    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }



};



function removeProperty(req,res){



    try {
        console.log("inside remove property in property.js");
        console.log(req.param("property_id"));
        mq_client.make_request('removeProperty',{"property_id":req.param("property_id"),"activation":0}, function(err,results) {
            console.log(results);
            if(err)
            {
                console.err("An error Occured.");
                console.log(err);
                res.send({"statusCode":404});
            }
            else if(results.statusCode == 200)
            {

                res.send({"statusCode":200});
            }
            else
            {
                res.send({"statusCode":404});
            }
        });


    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }

}
exports.removeProperty =removeProperty;
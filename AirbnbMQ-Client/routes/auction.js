"use strict";

var mq_client = require('../rpc/client');
var CronJob = require('cron').CronJob;
var dateTime = require('./DateTime');
var winston = require('winston');

var fs = require('fs');
var cronProperty = [];

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)( { filename: './BiddingLogs/bidding.log', level: 'info', timestamp:false})
	]
});
var user_logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)( { filename: './userTrackingLogs/userTacking.log', level: 'info', timestamp:false})
    ]
});

var auctionEnteries = {"cDate":dateTime.getCurrentDateTime()};

mq_client.make_request('getAuctionsToStart',auctionEnteries, function(err,results) {
	if(err)
	{
		console.err("An error Occured.");
		//
	}
	else if(results.statusCode == 200)
	{
		var i = 0;
		for(i;i<results.property.length; i++)
		{
			startAuctions(results.property[i],function(statusCode){

			});
		}
	}
	else
	{
		console.err("An error Occured.");
	}
});

function startAuctions(entry,callback)
{
	var job = new CronJob(new Date(entry.end_time), function() {
			console.log("Property Auction Finished ");
			var completeAuction = {"auction_id":entry.auction_id,"transaction_date":dateTime.getCurrentDateTime()};

			mq_client.make_request('completeAuction',completeAuction, function(err,results) {
				if(err)
				{
					console.err("An error Occured.");
					//
				}
				else
				{
					var i =0;
					var toDelete;
					for(;i<cronProperty.length;i++)
					{
						if(cronProperty[i].cron == this)
						{
							cronProperty[i].cron.stop();
							toDelete = i;
							break;
						}
					}
					cronProperty.splice(toDelete,1);
					this.stop();
					console.log("Auction Completed");
				}
			});
		}, function () {
			console.log("Stopping cron!!");
		},
		true
	);

	var logJob = new CronJob('0 0 * * * *', auctionLogs , function() {console.log("Stopping bdidding logs!!");},true);


	logger.log('info', "Started auction for auction_id"+ entry.auction_id +"time: "+ new Date().toString());
	cronProperty.push({"cron":job,"property_id":entry.property_id,"auction_id":entry.auction_id});
	callback({"statusCode":200});
}

function terminateAuction(entry,callback)
{
	var i =0;
	var toDelete;
	for(;i<cronProperty.length;i++)
	{
		if(cronProperty[i].cron == this)
		{
			cronProperty[i].cron.stop();
			toDelete = i;
			break;
		}
	}
	cronProperty.splice(toDelete,1);
}

function auctionLogs()
{

	var currentTime = {"cDate":dateTime.getCurrentDateTime()};
	mq_client.make_request('auctionLogs',currentTime, function(err,results) {

		if(err)
		{
			console.log(err);
			throw err;
		}
		else if (results.statusCode == 200)
		{
			results.auction.forEach(function(row){
					logger.log('info', "auction_id"+ row.auction_id +" max bid: " +row.bid_price +  " time: "+ new Date().toString());
			});
		}
	});
}

exports.startAuctions = startAuctions;
exports.terminateAuction = terminateAuction;
exports.user_logger = user_logger;
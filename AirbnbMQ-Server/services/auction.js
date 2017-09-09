var connect = require('./mysqlconnect1');

function addToAuction(req,msg,callback)
{


	try{
		var query="INSERT INTO auction(property_id,start_date,end_date) values (+'"+msg.property_id +"','"+msg.start_date+"','"+msg.end_date+"');";
		console.log(query);
		var res = {};
		connect.exec(query,msg,function (err,rows) {
			if(err)
			{console.log(err);
				res.statusCode = 404;
				callback(null,res);
			}
			else
			{
				console.log("inserted in auction");
				var query1 = "select * from auction where auction_id = " + rows.insertId;
				connect.exec(query1,msg,function (err1,rows1) {
					if(err1)
					{
						res.statusCode = 404;
						callback(null,res);
					}
					else
					{console.log("gtting added auction");
						res.statusCode = 200;
						res.auction = rows1[0];
						callback(null,res);
					}
				});
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


}


function getAuctionsToStart(msg,callback)
{


	try{
		var query='select * from auction where end_date >= ?;';
		var params=[msg.cDate];
		var res = {};
		connect.exec(query,params,function (err,rows) {
			if(err)
			{
				res.statusCode = 404;
				callback(null,res);
			}
			else if(rows.length == 1)
			{
				res.statusCode = 200;
				res.property = rows;
				callback(null,res);
			}
			else
			{
				res.statusCode = 404;
				callback(null,res);
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


}

function completeAuction(msg,callback)
{


	try{

		var query1 = 'select T3.auction_id, T3.bid_id, T3.bidder_id, T3.property_id, T3.bid_price, properties.start_date, properties.end_date from properties inner join (select auction_id, T2.bid_id, property_id, T2.bid_price, T2.bidder_id from auction inner join (select bid_id, max(bid_price) as bid_price, bidder_id  from bids where auction_id = ?) as T2 where auction.auction_id = ?) as T3 where properties.property_id = T3.property_id;';
		var params1=[msg.auction_id,msg.auction_id] ;
		var connection = connect.getconnection();
		var res = {};

		connection.beginTransaction(function(err) {
			if (err) {
				res.statusCode = 404;
				callback(null, res);
			}
			else
			{
				connection.query(query1,param1,function (err1, results1){
					if(err1)
					{
						res.statusCode = 404;
						callback(null, res);
					}
					else
					{
						var params2 = {
							"property_id":results1.property_id,
							"total_price":results1.bid_price,
							"start_date":results1.startDate,
							"end_date":results1.endDate,
							"customer_id":results1.bidder_id,
							"status":"accepted",
							"hide":0
						};
						var query2 = 'insert into bookings set ?';
						connection.query(query2,param2,function (err2, results2){
							if(err1)
							{
								res.statusCode = 404;
								callback(null, res);
							}
							else
							{

								var params3 = {
									"user_id":results1.bidder_id,
									"transaction_date":msg.transaction_date,
									"booking_id":results2.booking_id,
									"total_price":results1.bid_price
								};

								var query3 = 'insert into transaction set ?';
								connection.query(query3,param3,function (err3, results3){
									if(err3)
									{
										res.statusCode = 404;
										callback(null, res);
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
											connect.returnConnection(connection);
											res.statusCode = 200;
											callback(null,res);
										});
									}
								});
							}
						});
					}
				});
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


}
function auctionLogs(msb,callback)
{


	try{
		var query='select bids.auction_id, max(bid_price) as bid_price from bids,auction where auction.end_date >= ? group by bids.auction_id;';
		var params=[msg.cDate];
		var res = {};
		connect.exec(query,params,function (err,rows) {
			if(err)
			{
				res.statusCode = 404;
				callback(null,res);
			}
			else if(rows)
			{
				res.auction = rows;
				res.statusCode = 200;
				callback(null,res);
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



}
exports.auctionLogs = auctionLogs;
exports.addToAuction = addToAuction;
exports.completeAuction = completeAuction;
exports.getAuctionsToStart = getAuctionsToStart;
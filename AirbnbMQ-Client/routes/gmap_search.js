/**
 * Created by Nilam on 11/21/2016.
 */
var ejs = require("ejs");
var mq_client = require('../rpc/client');
var geocoder = require('geocoder');


exports.getPropertyListings = function (req, res) {


	try {

		var msg_payload = {};

		console.log("In getPropertyListings Request");

		mq_client.make_request('gmap_search_queue', msg_payload, function (err, results) {

			res.send(results);
		});

	}
	catch(e)
	{

		res.send({statusCode:417},{message:"Could not serve your request"});

	}



};

exports.gmapSearch = function (req, res) {


	try {

		if (req.session.listing) {
			var checkin = req.session.checkin;
			var checkout = req.session.checkout;
			var listing = req.session.listing;
			var guests = req.session.guests;
			var where = req.session.where;

			// geocode where(searched location) and send in response
			geocoder.geocode(where, function (err, data) {
				if (err) {
					res.send({"statusCode": 401})
				}

				console.log("Data", where, data.results[0].geometry.location);

				res.send({
					"statusCode": 200,
					"search": "Success",
					"listing": listing,
					"checkin": checkin,
					"checkout": checkout,
					"guests": guests,
					"where": where,
					"whereLat": data.results[0].geometry.location.lat,
					"whereLng": data.results[0].geometry.location.lng
				});
			});
		}
		else {
			res.send({"statusCode": 401})
		}

	}
	catch(e)
	{

		res.send({statusCode:417,message:"Could not serve your request"});

	}


};


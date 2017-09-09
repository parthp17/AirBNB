//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var admin=require('./services/admin');
var registeruser=require('./services/registeruser');
var signin=require('./services/signin');
var profile=require('./services/profile');
var account=require('./services/account');
var dashboard=require('./services/dashboard');
var billing=require('./services/billing');
var listing=require('./services/listing');
var property=require('./services/property');
var reviews=require('./services/reviews');
var search = require('./services/search');
var getAllProperties = require('./services/getAllProperties');
var guests = require('./services/guests');
var auction=require('./services/auction.js');
var cnn = amqp.createConnection({host:'127.0.0.1'});


cnn.on('ready', function(){
	console.log("listening on login_queue");

	//change user password
	cnn.queue('password_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			registeruser.changepassword(req,message, function(req,res){
				console.log("inside password_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	//request to be host
	cnn.queue('makehost_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			registeruser.makehost(req,message, function(req,res){
				console.log("inside makehost_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	//add host review
	cnn.queue('posthostreview_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			reviews.postReviewByHost(req,message, function(req,res){
				console.log("inside posthostreview_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	//auction start
	cnn.queue('addToAuction', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			auction.addToAuction(req,message, function(req,res){
				console.log("inside addToAuction");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	//hide approvals
	cnn.queue('hideapprovals_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			dashboard.hideapprovals(req,message, function(req,res){
				console.log("inside hideapprovals_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	//remove property
	cnn.queue('removeProperty', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			property.removeProperty(req,message, function(req,res){
				console.log("inside removeProperty");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	//get details of a property for edit
	cnn.queue('getPropertyDetails', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			property.getPropertyDetails(req,message, function(req,res){
				console.log("inside getPropertyDetails");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('updateProperty', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			property.updateProperty(req,message, function(req,res){
				console.log("inside updateProperty server");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});



	//post user reviews
	cnn.queue('userreviews_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			reviews.postuserreviews(req,message, function(req,res){
				console.log("inside userreviews_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	//get reviews
	cnn.queue('getreviews_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			reviews.getreviews(req,message, function(req,res){
				console.log("inside getreviews_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	//addproperty
	cnn.queue('addProperty', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			property.addProperty(req,message, function(req,res){
				console.log("inside gethostid_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	//gethostid
	cnn.queue('gethostid_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			signin.gethostid(req,message, function(req,res){
				console.log("inside gethostid_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	//getlist
	cnn.queue('getlisting_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			listing.getlist(req,message, function(req,res){
				console.log("inside getlisting_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	//genbill
	cnn.queue('genbills_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			billing.genbills(req,message, function(req,res){
				console.log("inside genbills_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	//host disapprove
	cnn.queue('hostdisapprove_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			dashboard.hostdisapprove(req,message, function(req,res){
				console.log("inside hostdisapprove_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	//hostapprove
	cnn.queue('hostapprove_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			dashboard.hostapprove(req,message, function(req,res){
				console.log("inside hostapprove_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	//get dashboard
	cnn.queue('getdashboard_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			dashboard.getdashboard(req,message, function(req,res){
				console.log("inside getdashboard_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	//delete host
	cnn.queue('deletehost_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			account.deletehost(req,message, function(req,res){
				console.log("inside deletehost_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	//delete user
	cnn.queue('deleteuser_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			account.deleteaccount(req,message, function(req,res){
				console.log("inside deleteuser_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

    cnn.queue('approve_hosts_queue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            admin.approval(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });


	//user account fetch
	cnn.queue('myaccount_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			account.myaccount(req,message, function(req,res){
				console.log("inside myaccount_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	//change stay
	console.log("listening on change_queue");
	cnn.queue('change_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			guests.change(message, function(req,res){
				console.log("inside myaccount_queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	//update profile
	cnn.queue('updateprofile_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			profile.updateprofile(req,message, function(req,res){
				console.log("inside update profile");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	}); //cnn.queue


	//get user profile queue
	cnn.queue('profilereq_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			profile.userprofile(req,message, function(req,res){
				console.log("inside user profile");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	}); //cnn.queue


	//registeruser queue
	cnn.queue('registeruser_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			registeruser.registeruser(req,message, function(req,res){
				console.log("inside register user");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	}); //cnn.queue

	//user signup
	cnn.queue('signin_queue', function(req,res){
		req.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			signin.signin(req,message, function(req,res){
				console.log("inside signin user queue");
				console.log("message:"+message);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	}); //cnn.queue

	//user login
	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.handle_request(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});



	console.log("listening on admin_login_queue");
	cnn.queue('admin_login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.validate(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	console.log("listening on admin_register_queue");
	cnn.queue('admin_register_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.register(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	//search on homepage
	console.log("listening on search_queue");
    cnn.queue('search_queue', function (q) {
        q.subscribe(function (message, headers, deliveryInfo, m) {
            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
            search.handle_search(message, function (err, res) {

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType: 'application/json',
                    contentEncoding: 'utf-8',
                    correlationId: m.correlationId
                });
            });
        });
    });

    //get all properties on homepage

	console.log("listening on getAllProperties_queue");
    cnn.queue('getAllProperties_queue', function (q) {
        q.subscribe(function (message, headers, deliveryInfo, m) {
            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
            getAllProperties.handle_search(message, function (err, res) {

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType: 'application/json',
                    contentEncoding: 'utf-8',
                    correlationId: m.correlationId
                });
            });
        });
    });

    console.log("listening on filter_queue");
    cnn.queue('filter_queue', function (q) {
        q.subscribe(function (message, headers, deliveryInfo, m) {
            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
            search.handle_filter(message, function (err, res) {

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType: 'application/json',
                    contentEncoding: 'utf-8',
                    correlationId: m.correlationId
                });
            });
        });
    });

    cnn.queue('bid_queue', function (q) {
        q.subscribe(function (message, headers, deliveryInfo, m) {
            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
            guests.handle_bid(message, function (err, res) {

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType: 'application/json',
                    contentEncoding: 'utf-8',
                    correlationId: m.correlationId
                });
            });
        });
    });

        console.log("listening on property_queue");
        cnn.queue('property_queue', function(q){
            q.subscribe(function(message, headers, deliveryInfo, m){
                util.log(util.format( deliveryInfo.routingKey, message));
                util.log("Message: "+JSON.stringify(message));
                util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
                guests.property(message, function(err,res){

                    //return index sent
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });
                });
            });
        });
    });


	cnn.on('ready', function(){

        console.log("listening on guests_queue");
        cnn.queue('guests_queue', function(q){
            q.subscribe(function(message, headers, deliveryInfo, m){
                util.log(util.format( deliveryInfo.routingKey, message));
                util.log("Message: "+JSON.stringify(message));
                util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
                guests.handle_request(message, function(err,res){

                    //return index sent
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });
                });
            });
        });


        console.log("listening on rent_queue");
        cnn.queue('rent_queue', function(q){
            q.subscribe(function(message, headers, deliveryInfo, m){
                util.log(util.format( deliveryInfo.routingKey, message));
                util.log("Message: "+JSON.stringify(message));
                util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
                guests.handle_req(message, function(err,res){

                    //return index sent
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });
                });
            });
        });
    });

cnn.on('ready', function () {
        console.log("listening on add_queue");
        cnn.queue('add_queue', function(q){
            q.subscribe(function(message, headers, deliveryInfo, m){
                util.log(util.format( deliveryInfo.routingKey, message));
                util.log("Message: "+JSON.stringify(message));
                util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
                guests.add(message, function(err,res){

                    //return index sent
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });
                });
            });
        });

     console.log("listening on load_queue");
     cnn.queue('load_queue', function(q){
         q.subscribe(function(message, headers, deliveryInfo, m){
             util.log(util.format( deliveryInfo.routingKey, message));
             util.log("Message: "+JSON.stringify(message));
             util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
             guests.load(message, function(err,res){

                 //return index sent
                 cnn.publish(m.replyTo, res, {
                     contentType:'application/json',
                     contentEncoding:'utf-8',
                     correlationId:m.correlationId
                 });
             });
         });
     });
 

//vivek
// 

console.log("listening on admin_login_queue");
	cnn.queue('admin_login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.validate(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	console.log("listening on admin_register_queue");
	cnn.queue('admin_register_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.register(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	cnn.queue('get_pending_hosts_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.getPending(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('get_pending_hosts_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.getPending(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	 cnn.queue('topPropertiesQueue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            admin.topProperties(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });

cnn.queue('cityRevenueQueue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            admin.cityRevenue(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });

    cnn.queue('topHostsQueue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            admin.topHosts(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });
cnn.queue('getBillsQueue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.getBills(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('getHostsQueue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.getHosts(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('clicks_per_page_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.getClicksPerPage(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('less_seen_page_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.getLessSeen(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	console.log("listening on admin_login_queue");
	cnn.queue('admin_login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.validate(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	console.log("listening on admin_register_queue");
	cnn.queue('admin_register_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.register(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('hostStatsQueue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.getHostStat(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('propRatingsQueue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.getPropRatings(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('bidTraceQueue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.getBidTrace(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('userTraceQueue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.userTrace(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

    cnn.queue('logging_queue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            search.userTrace(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });
});
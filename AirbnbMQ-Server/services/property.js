var connect = require('./mysqlconnect1');
var mongoose = require('./mongoose');
var http=require("http");
var mysql=require("./mysql");


function addProperty(req,msg,callback)
{


	try{

		console.log("inside add property.js");
		//var query='INSERT INTO properties SET ?;';


		var query="INSERT INTO properties(`host_id`,`title`,`description`,`category_name`,`price`,`is_bidding`,`bedrooms`,`bathrooms`,`capacity`,`line1`,`line2`,`city`,`state`,`zipcode`,`country`,`available_from`,`available_to`,`activation`,`latitude`,`longitude`) VALUES ('"+msg.propertyDetails.host_id+"','"+msg.propertyDetails.title+"','"+msg.propertyDetails.description+"','"+msg.propertyDetails.category_name+"','"+msg.propertyDetails.price+"','"+msg.propertyDetails.is_bidding+"','"+msg.propertyDetails.bedrooms+"','"+msg.propertyDetails.bathrooms+"','"+msg.propertyDetails.capacity+"','"+msg.propertyDetails.line1+"','"+msg.propertyDetails.line2+"','"+msg.propertyDetails.city+"','"+msg.propertyDetails.state+"','"+msg.propertyDetails.zipcode+"','"+msg.propertyDetails.country+"','"+msg.propertyDetails.available_from+"','"+msg.propertyDetails.available_to+"','"+msg.propertyDetails.activation+"','"+msg.propertyDetails.latitude+"','"+msg.propertyDetails.longitude+"')";
		//var params=[msg.propertyDetails];
		console.log(query);
		var res = {};

		//connect.exec(query,params,function (err,rows) {

		mysql.fetchData(function (err,rows) {

			console.log("inside myfecth");
			if(err)
			{
				console.log(err);
				throw err;
				res.statusCode = 404;
				callback(req,res);
			}
			else
			{
				console.log("inside else");
				var property = new mongoose.property({
					"property_id":rows.insertId,
					"image":msg.propertyMedia.image,
					"video":msg.propertyMedia.video
				});
				property.save(function (errors,responses) {

					if(errors)
					{
						console.log(errors);
					}
					else
					{
						res.statusCode = 200;
						res.property_id = rows.insertId;
						console.log("in mongoose");
						callback(req,res);
					}
				});
				/*
				 var last = msg.propertyMedia.files.length-1;
				 var i = -1;
				 msg.propertyMedia.files.forEach(function(f){
				 i++;

				 property.addAttachment('media'+i, f.buffer)
				 .then(function(doc) {
				 console.log(" doc ");
				 doc.save();
				 if(f == msg.propertyMedia.files[last])
				 {
				 res.statusCode = 200;
				 res.property_id = rows.insertId;
				 console.log("in mongoose");
				 callback(req,res);
				 }
				 })
				 .catch(function(err) {
				 throw err;
				 })
				 .done();
				 });*/
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


}



function updateProperty(req,msg,callback)
{


	try{

		var query='update properties set ? where property_id = ? ;';
		var params=[msg.updatePropertyDetails,msg.property_id];
		console.log("inside updateProperty");
		var res = {};
		connect.exec(query,params,function (err,rows) {
			console.log("err"+err);
			console.log(rows);
			console.log("rows affected"+rows.affectedRows);
			console.log("rows"+rows.length);
			if(err)
			{
				res.statusCode = 404;
				callback(req,res);
			}
			else if(rows.affectedRows)
			{
				console.log("1");
				if( msg.updatePropertyMedia != undefined)
				{
					mongoose.property.findOne({"property_id": msg.property_id}, function(error, property1){
						console.log(property1);
						if(property1)
						{
							console.log(2);
							property1.image = msg.updatePropertyMedia.image;
							property1.video = msg.updatePropertyMedia.video;
							property1.save(function(errors,results){
								if(!errors)
								{console.log(3);
									res.statusCode = 200;
									callback(req,res);
								}
								else
								{console.log(4);
									res.statusCode = 404;
									callback(req,res);
								}
							});
						}
						else
						{console.log(5);
							res.statusCode = 200;
							callback(req,res);
						}
					});

				}
				else
				{
					res.statusCode = 200;
					callback(req,res);
				}

				/*mongoose.property.find({"property_id": msg.property_id}, function(error, property1){
				 if(property1.length > 0)
				 {
				 if(msg.updatePropertyMedia.files[0] != undefined)
				 {console.log("2");
				 property1[0].updateAttachment('media0',msg.updatePropertyMedia.files[0].buffer)
				 .then(function(doc){
				 doc.save();
				 if(msg.updatePropertyMedia.files[1] != undefined)
				 {console.log("3");
				 property1[0].updateAttachment('media1',msg.updatePropertyMedia.files[1].buffer)
				 .then(function(doc1){
				 doc1.save();
				 res.statusCode = 200;
				 callback(req,res);
				 }).catch(function(err){

				 });
				 }

				 }).catch(function(err){
				 throw err;
				 });
				 }
				 if(msg.updatePropertyMedia.files[0] == undefined && msg.updatePropertyMedia.files[1] != undefined)
				 {console.log("5");
				 property1[0].updateAttachment('media1',msg.updatePropertyMedia.files[1].buffer)
				 .then(function(doc){
				 doc.save();
				 res.statusCode = 200;
				 callback(req,res);
				 }).catch(function(err){

				 });
				 }
				 else
				 {
				 res.statusCode = 200;
				 callback(req,res);
				 }
				 }
				 else
				 {
				 res.statusCode = 200;

				 callback(req,res);
				 }

				 });*/
			}
			else
			{console.log("4");
				res.statusCode = 404;
				callback(req,res);
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

function getPropertyDetails(req,msg,callback)
{


	try{
		console.log(" inside getPropertyDetails in property.js"+msg.property_id);
		var query='select * from properties where property_id=? and activation = ?;';
		var params=[msg.property_id,'1'];
		var res = {};
		console.log("1");
		connect.exec(query,params,function (err,rows) {
			console.log("error");
			console.log(err);
			console.log("rows");
			console.log(rows);
			if(err)
			{
				res.statusCode = 404;
				callback(req,res);
			}
			else if(rows.length == 1)
			{
				console.log(rows.length);
				res.statusCode = 200;
				res.property = rows[0];
				callback(req,res);
				/*
				 console.log(rows[0].property_id);
				 mongoose.property.find({"property_id": rows[0].property_id}, function(err, property1){
				 console.log(property1);
				 console.log(property1[0]);
				 if(property1)
				 {
				 property1[0].load()
				 .then(function(doc) {
				 res.statusCode = 200;
				 res.property = rows[0];
				 res.image = doc.attachments[0].buffer;
				 res.video = doc.attachments[1].buffer;
				 callback(req,res);
				 })
				 .catch(function(err) {
				 throw err;
				 })
				 .done();
				 }
				 });

				 */
			}
			else
			{
				res.statusCode = 404;
				callback(req,res);
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

function removeProperty(req,msg,callback)
{


	try{

		console.log("inside remove property.js"+msg.property_id);
		console.log(msg);
		var query='update properties set activation = ? where property_id = ?;';
		var params=[msg.activation,msg.property_id];
		var res = {};
		connect.exec(query,params,function (err,rows) {
			console.log("err");
			console.log(err);
			console.log("rows");
			console.log(rows);
			if(err)
			{
				console.log("inside err");
				res.statusCode = 404;
				callback(req,res);
			}
			else if(rows.affectedRows>0)
			{
				console.log("inside sc 200");
				res.statusCode = 200;
				res.property = rows[0];
				callback(req,res);
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

function getMyProperties(req,msg,callback)
{


	try{
		var query='select * from properties where host_id=?;';
		var params=[msg.host_id];
		var res = {};
		connect.exec(query,params,function (err,rows) {
			if(err)
			{
				res.statusCode = 404;
				callback(req,res);
			}
			else if(rows)
			{
				var arrayProperty = [];
				rows.forEach(function(prop){
					mongoose.property.find({"property_id": prop.property_id}, function(err, property1){
						property1[0].load()
							.then(function(doc) {
								doc.attachments.forEach(function(attachment) {
									if (attachment.filename.lastIndexOf('.jpg') > -1 ){
										var propToShow = {
											"property":prop,
											"image":attachment.buffer,
										}
										arrayProperty.push(propToShow);
										if(prop == rows[rows.length-1])
										{
											res.property = arrayProperty;
											res.statusCode = 200;
											callback(req,res);
										}
									}
								});
							})
							.catch(function(err) {
								throw err;
							})
							.done();
					});
				});
			}
			else
			{
				res.statusCode = 404;
				callback(req,res);
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

exports.getMyProperties = getMyProperties; 
exports.removeProperty = removeProperty;
exports.updateProperty = updateProperty;
exports.getPropertyDetails = getPropertyDetails;
exports.addProperty = addProperty;
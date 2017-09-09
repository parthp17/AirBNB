"use strict";

var mongoose = require("mongoose");
var mongooseGM = require("mongoose-gm");
var mongoDbUrl = "mongodb://ds061984.mlab.com:61984/airbnb";

mongoose.Promise = global.Promise;
var options={
	user: 'root',
	pass: 'root'
};

var connection = mongoose.connect(mongoDbUrl,options);
var Schema = mongoose.Schema;

var propertySchema = new Schema({
	"property_id":{type:Number, required:true},
	"image":{type:String},
	"video":{type:String}
});


//propertySchema.plugin(mongooseGM);

var userSchema = new Schema({
	"user_id":{type:Number, required:true}
});
userSchema.plugin(mongooseGM);


var reviewsByHostSchema = new Schema({
	"transaction_id":{type:String, required:true},
	"host_id":{type:String, required:true},
	"host_name":{type:String, required:true},
	"user_id":{type:String, required:true},
	"rating":{type:String, required:true},
	"review_content":{type:String, required:true}
});


var reviewsByUserSchema = new Schema({
	"transaction_id":{type:String, required:true},
	"host_id":{type:String, required:true},
	"user_id":{type:String, required:true},
	"rating":{type:String, required:true},
	"review_content":{type:String, required:true},
	"property_id":{type:String, required:true},
	"user_name":{type:String,required:true},
	"property_title":{type:String, required:true}
});


reviewsByHostSchema.plugin(mongooseGM);
reviewsByUserSchema.plugin(mongooseGM);


var property = mongoose.model('property',propertySchema,'property');
var reviewByHost = mongoose.model('reviewsForHost',reviewsByHostSchema,'reviewsForHost');
var reviewByUser = mongoose.model('reviewByUser',reviewsByUserSchema,'reviewByUser');
var user = mongoose.model('user',userSchema,'user');

exports.property = property;
exports.reviewByHost = reviewByHost;
exports.reviewByUser = reviewByUser;
exports.user = user;
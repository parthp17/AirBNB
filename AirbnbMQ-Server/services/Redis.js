//Remember to make sure the Redis server is running!
var redis = require('redis');

var client = redis.createClient(); //creates a new client

client.on('connect', function() {
    console.log('Redis is Connected');
});

exports.store=function (key,values,callback) {

    for(i in values){
        client.SADD(key, JSON.stringify(values[i]),function (err,reply) {
            if(!err){
                callback(null,reply)
            }
            else{
                callback(err,reply)
            }
        });
    }

}

exports.fetch=function (key,callback) {

    client.SMEMBERS(key, function(err, array) {
        if(!err){
            for(i in array){
                array[i]=JSON.parse(array[i])
            }
            callback(null,array);
        }
        else{
            callback(err,array);
        }
    });

}

exports.delete=function (key,callback) {
    client.del(key, function(err, reply) {
        if(!err){
            callback(null,reply);
        }
        else{
            console.log(err);
            callback(err,reply);
        }
    });
}
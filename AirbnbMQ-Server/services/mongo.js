var MongoClient=require ('mongodb').MongoClient;
var connected = false;
var dbConnection;
var db;
var pool=[];
var url = "mongodb://root:root@ds061984.mlab.com:61984/airbnb";


// mongoose.Promise = global.Promise;
var options={
    user: 'root',
    pass: 'root'
};
for(var i=0;i<20;i++){
    try {
        MongoClient.connect(url, function (err, dbconnection) {
            if (err) {
                console.log("Could not connect to mongoserver error :" + err)
                throw new Error('could not connect to MongoServer :' + err);
            }
            console.log("Connect to Mongo Server.")
            dbConnection = dbconnection;
            connected = true;
            pool.push(dbConnection);
        });
    }
    catch(err){
        console.log("Exception while trying to connect to MongoServer :"+err);
    }
}

console.log("Total Pool Connections :"+pool.length);

// exports.connect = function (url,callback) {
//     if(pool.length!=0){
//         callback(pool.pop());
//     }
//
//     else{
//         return null;
//     }
//     // console.log("Trying to connect to MongoDB server");
//     // try {
//     //     MongoClient.connect(url, function (err, dbcontainer) {
//     //
//     //         if (err) {
//     //             console.log("Could not connect to mongoserver error :" + err)
//     //             throw new Error('could not connect to MongoServer :' + err);
//     //         }
//     //         console.log("Connect to Mongo Server.")
//     //         db = dbcontainer;
//     //         connected = true;
//     //         callback(db)
//     //
//     //     });
//     // }
//     // catch(err){
//     //     console.log("Exception while trying to connect to MongoServer :"+err);
//     // }
// };



exports.collection=function (name) {

    if(pool.length!=0){
        if(!connected){
            console.log("Not connected to mongoServer!!")
            throw new Error('Must connect to the Mongo Server before calling connection');
        }
        console.log("sending back collection for :"+name);

        dbConnection=pool.pop(); //current Database Connection after popping from pool.
        console.log("Current pool length :"+pool.length);
        return dbConnection.collection(name);
    }

    else{
        console.log("Connection pool is empty");
        if(checkAvailability()==true){
            return connection.pop();
        }
    }

};

exports.returnConnection=function () {
    pool.push(dbConnection);// current Database Connection is again pushed in pool
    console.log("After Connection is returned pool size :"+pool.length);
}

checkAvailability=function () {
    setInterval(function () {
        if(connection.length==0){
            return false;
        }
        else
            return true;
    },1000)
}
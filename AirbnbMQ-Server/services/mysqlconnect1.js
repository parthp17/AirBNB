var mysql = require('mysql');

var pool=[];

var queue=[];

for(var i=0;i<100;i++) {
    pool.push(mysql.createConnection({
        host: 'airbnb.cxrsbkmmk9a6.us-west-2.rds.amazonaws.com',
        user: 'master',
        password: 'masteruser',
        database: 'airbnb'
    }));
}

var c=0;

getconnection=function(){


        if(pool.length!=0)
        {
           // console.log("Connection "+c+" is requested and available with type :"+typeof pool+" length :"+pool.length);
            c++;
            return pool.pop();
       }

        else{
            console.log("Connection pool is empty");
            console.log("Request Pending...");
            if(checkAvailability()==true)
                return pool.pop();
        }
};

exports.exec=function (query,params,callback) {
    connection =getconnection();
    connection.query(query,params, function (err, rows, fields){
        if(!err){
            console.log("Rows returned as "+rows);
                callback(err,rows);
        }
        else{
            console.log('MYSQL error encountered as :'+err);
            callback(err,rows);
        }
    })
    returnConnection(connection);
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

returnConnection=function(oldconnection){
    pool.push(oldconnection);
}
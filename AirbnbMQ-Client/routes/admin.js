var mq_client = require('../rpc/client');

exports.getPropRatings=function (req,res) {
    console.log("Fetching property ratings with pid :"+req.param("pid"));
    mq_client.make_request('propRatingsQueue',{"pid":req.param("pid")}, function(err,results) {
        console.log("Got ratings results as :"+results.value);
        res.send(results.value);
    });
}

exports.getBidTrace=function (req,res) {
    console.log("Fetching bidding trace as :"+req.param("pid"));
    mq_client.make_request('bidTraceQueue',{"pid":req.param("pid")}, function(err,results) {
        console.log("Got host analytics results as :"+results.value);
        res.send(results.value);
    });
}

exports.trackUser=function (req,res) {
    console.log("Fetching user activity trace as :"+req.param("name"));
    mq_client.make_request('userTraceQueue',{"name":req.param("name")}, function(err,results) {
        res.send(results.value);
    });
}


exports.getHostStat=function (req,res) {

    console.log("Fetching host analysis as :"+req.param("pid"));
    mq_client.make_request('hostStatsQueue',{"pid":req.param("pid")}, function(err,results) {
        console.log("Got host analytics results as :"+results.value);
        res.send(results.value);
    });
}

exports.loadpage=function (req,res) {
    if(req.session.username!=null){
        res.redirect('/admindash');
    }

    res.render('adminlogin.ejs');
}

exports.dashboard=function (req,res) {
    if(req.session.username==null)
        res.redirect('/admin');
    res.render("admindash.ejs");
}

exports.logout=function (req,res) {
    console.log("Logging out the user now");

    req.session.destroy();
    res.send("logout");

}

exports.getLessSeen=function (req,res) {

    mq_client.make_request('less_seen_page_queue',{}, function(err,results) {
        res.send(results.value);
    });

}

exports.clicksPerPage=function (req,res) {
    mq_client.make_request('clicks_per_page_queue',{}, function(err,results) {
        res.send(results.value);
    });
}


exports.validate=function(req,res){
    var msg_payload={"username":req.param("username"),"password":req.param("password")};

    console.log("checking admin credentials");

    mq_client.make_request('admin_login_queue',msg_payload, function(err,results) {
        console.log("Results for admin validation recvd as :" + JSON.stringify(results));
        if (err) {
            throw err;
        }
        else {
                if(results.value.result=="success"){
                    console.log("Admin Login success ");
                    req.session.username=req.param("username");
                    req.session.password=req.param("password");

                }
                res.send(results.value);
        }
    });
}

exports.getPending=function (req,res) {

    mq_client.make_request('get_pending_hosts_queue',{},function (err,results) {
        // console.log("Pending hosts received as :"+JSON.stringify(results));
        if (err) {
            throw err;
        }
        else {
            res.send(results.value);
        }

    })
}

exports.approve=function (req,res) {

    mq_client.make_request('approve_hosts_queue',{"host_id":req.param("host_id"),"approval":req.param("approval")},function (err,results) {
        // console.log("Pending hosts received as :"+JSON.stringify(results));
        if (err) {
            throw err;
        }
        else {
            res.send(results.value);
        }

    })
}

exports.topProperties=function (req,res) {
    mq_client.make_request('topPropertiesQueue',{}, function(err,results) {
        if(err){
            throw err;
        }
        else{

            res.send(results.value);
        }
    });
}

exports.topHost=function (req,res) {
    mq_client.make_request('topHostsQueue',{}, function(err,results) {
        if(err){
            throw err;
        }
        else{
            res.send(results.value);
        }
    });
}

exports.cityRevenue=function (req,res) {
    mq_client.make_request('cityRevenueQueue',{},function (err,results) {
        if(err){
            throw err;
        }
        else{

            res.send(results.value);
        }
    })
}

exports.register=function (req,res) {
    var fname=req.param("fname");
    var lname=req.param("lname");
    var username=req.param("username");
    var password=req.param("password");
    var auth=req.param("auth");


    if(auth!=007){
        res.send({"result":"unauthorised"})
    }

    else{
        var msg_payload={"username":username,"password":password,"fname":fname,"lname":lname,"auth":auth};

        mq_client.make_request('admin_register_queue',msg_payload, function(err,results) {
            console.log("Results for admin registration recvd as :" + JSON.stringify(results));
            if (err) {
                throw err;
            }
            else {
                res.send(results.value);
            }
        });
    }
}

exports.fetchBills=function (req,res) {
    var msg_payload=req.param("package");
    console.log("Type is as follows :"+msg_payload.type);
    mq_client.make_request('getBillsQueue',msg_payload,function (err,results) {
        if(err){
            throw err;
        }
        else{
            res.send(results.value);
        }

    })
};


exports.fetchHosts=function (req,res) {
    var msg_payload={"city":req.param("city")};
    console.log("Sending city as :"+req.param("city"));
    mq_client.make_request('getHostsQueue',msg_payload,function (err,results) {
        if(err){
            throw err;
        }
        else{
            res.send(results.value);
        }

    })
};
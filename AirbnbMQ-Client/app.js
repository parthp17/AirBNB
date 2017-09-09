var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , home = require('./routes/home')
  , admin=require('./routes/admin')
  , path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');
var multer=require('multer');

var storage = multer.memoryStorage();           //multer config
var uploading = multer({ storage: storage });

var registeruser=require('./routes/registeruser');
var pagererouting=require('./routes/pagererouting');
var signin_user=require('./routes/signin_user');
var profile=require('./routes/profile');
var account=require('./routes/account');
var dashboard=require('./routes/dashboard');
var billing=require('./routes/billing');
var listing=require('./routes/listing');
var property=require('./routes/property');
var reviews=require('./routes/reviews');
// var home = require('./routes/home');
var gmapSearch = require('./routes/gmap_search');
var product = require('./routes/product');

var app = express();

var mongoSessionConnectURL = "mongodb://root:root@ds061984.mlab.com:61984/airbnb";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);

app.use(expressSession({
  secret: 'cmpe273_teststring',
  resave: false,  //don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  duration: 30 * 60 * 10000,
  activeDuration: 5 * 60 * 10000,
  store: new mongoStore({
    url: mongoSessionConnectURL
  })
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// development only

app.get('/', routes.index);


//vivek

app.get('/admin',admin.loadpage);
app.post('/verifyAdmin',admin.validate);
app.post('/registerAdmin',admin.register);
app.get('/admindash',admin.dashboard);
app.get('/getPending',admin.getPending);
app.post('/approve',admin.approve);
app.get('/topProperties',admin.topProperties);
app.get('/cityRevenue',admin.cityRevenue);
app.get('/topHosts',admin.topHost);
app.post('/fetchBills',admin.fetchBills);
app.post('/getHosts',admin.fetchHosts);
app.get('/logout',admin.logout)
app.get('/clicksPerPage',admin.clicksPerPage);
app.get('/lessSeen',admin.getLessSeen);
app.post('/hostStat',admin.getHostStat);
app.post('/getpropertyRating',admin.getPropRatings);
app.post('/getBidTrace',admin.getBidTrace);
app.post('/trackUser',admin.trackUser);


/*
app.get('/signin',home.sign_in);
app.post('/signin', home.after_sign_in);
app.get('/success_login', home.success_login);
app.get('/fail_login', home.fail_login);


//app.get('/admin',admin.loadpage);
//app.post('/verifyAdmin',admin.validate);
//app.post('/registerAdmin',admin.register);
//app.get('/admindash',admin.dashboard);
*/

app.get('/homepage',function(req,res){
    console.log("inside /homepage..rerouting to homepage");
   pagererouting.homepage(req,res);
});

app.get('/requser',function(req,res){
    console.log("inside /requser..rerouting to homepage with user session");
    pagererouting.requser(req,res);
});

app.post('/registeruser',function(req,res){
    console.log("inside register user");
    registeruser.registeruser(req,res);
});

app.post('/signin',function(req,res){
    console.log("inside the signin app.js");
    signin_user.signin(req,res);
});

app.get('/userwindow',function(req,res) {
    console.log("inside the /userwindow ....");
    pagererouting.userwindow(req,res);

});

app.get('/profile',function(req,res){
   console.log("inside /getuserprofile");
    profile.getuserprofile(req,res);
});

app.post('/updateprofile',uploading.any(),function(req,res){
   console.log("inside /updateprofile");
    profile.updateprofile(req,res);
});

app.get('/myaccount',function(req,res){
    console.log("inside /myaccount");
     account.myaccount(req,res);
});

app.get('/deleteuser',function(req,res){
    console.log("inside /deleteuser");
    account.deleteuser(req,res);
});

app.get('/deletehost',function (req,res) {
    console.log("inside /deletehost");
    account.deletehost(req,res);
});

app.post('/logout',function(req,res){
   console.log("inside logout function");
    profile.logout(req,res);
});

app.get('/getdashboard',function(req,res){
    console.log("inside getdashboard");
    dashboard.getdashboard(req,res);
});


app.post('/hostapprove',function(req,res){
   console.log("inside hostapprove");
    dashboard.hostapprove(req,res);
});

app.post('/hostdisapprove',function(req,res){
    console.log("inside hostdisapprove");
    dashboard.hostdisapprove(req,res);
});

app.get('/fetchbills',function(req,res){
     console.log("inside billing");
     billing.genbills(req,res);
});


app.get('/createlisting',function(req,res){    //render new page
     console.log("inside create listing");
      listing.createlisting(req,res);
});

app.get('/getlisting',function(req,res){
     console.log("inside get listing");
    listing.getlisting(req,res);
});

app.post('/addProperty', uploading.any(),property.addProperty);

//app.post('/updateProperty', uploading.any(),property.updateProperty);

app.get('/getreviews',function(req,res){
    console.log("inside getreviews app.js");
     reviews.getreviews(req,res);
});

app.post('/postuserreview',uploading.any(),function(req,res){
    console.log("inside postuserreview app.js");
    reviews.postuserreview(req,res);
});

app.post('/posthostreview',function(req,res){
    console.log("inside posthostreview app.js");
    reviews.posthostreview(req,res);
});

app.get('/editlisting',function(req,res){
    console.log("inside editlisting app.js");
    property.editlistingpage(req,res);

});

app.post('/removeProperty',function(req,res){
    console.log("inside remove property app.js");
    property.removeProperty(req,res);
});

app.post('/hide',function(req,res){
    console.log("inside hide app.js");
    dashboard.hideapprovals(req,res);
});

app.get('/adminrequest',function(req,res){
    console.log("inside admin request");
    registeruser.adminrequest(req,res);
});

app.post('/changepassword',function(req,res){
    console.log("inside change password");
    registeruser.changepassword(req,res);
});

app.post('/updateProperty', uploading.any(),property.updateProperty);




/////////////kemy//////////////////
app.post('/search', home.search);
app.post('/getAllProperties', home.getAllProperties);
app.get('/map',routes.map);
app.post('/gmapSearch', gmapSearch.gmapSearch);
app.post('/displayProperty', product.displayProperty);
app.get('/displayProperties', product.display_property);
app.post('/propertydetails', product.propertydetails);
app.post('/details',product.details);
app.post('/change',product.change);
app.get('/payment',product.payment);
app.post('/load_details',product.load);
app.post('/add_details',product.enter);
app.post('/filter', home.filter);
app.post('/make_bid', product.make_bid);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
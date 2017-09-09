
function handle_request(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);
	
	if(msg.username == "test@email.com" && msg.password =="test"){
		res.code = "200";
		res.value = "Succes Login";
		
	}
	else{
		res.code = "401";
		res.value = "Failed Login";
	}
	callback(null, res);
}

exports.handle_request = handle_request;
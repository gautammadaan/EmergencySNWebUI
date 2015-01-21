var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Chat(from_user, to_user, message, time, location){
	  this = {
			  from_userName : user_name,
			  to_userName	:	to_user,
			  message 		: message,
			  message_timestamp:	time,
			  location		: location
	  };
	}

Chat.getChatUpdates = function (user1, user2, callback){
	//need to do something
	request(rest_api.get_chat_message + "/" + user1 + "/" + user2, {json:true}, function(err, res, body)
	{
		if (err !== null || res.statusCode !== 200)
		{
			callback(err, null, null);
			return;
	    }
		else if (err === null && res.statusCode === 200)
		{   
			request(rest_api.get_chat_users + "/" + user1 + "/chatbuddies", {json:true}, function(err1, res1, body1)
			{
				if(err1 !== null || res1.statusCode !== 200)
				{
					callback(err1, null, null);
					return;
				}
				else if(err1 === null && res1.statusCode === 200)
				{
					callback(null, res.body, res1.body);
					return;
				}
			})
		}
	});
};

Chat.postMessage = function(fromUser, toUser, message, callback){
	 console.log("sending message");
	 var options = {
		url : rest_api.post_new_chat + "/" + fromUser + "/" + toUser,
	    body : {from_User: fromUser, to_User: toUser , message: message},
	    json: true
	  };
	 console.log("from " + fromUser + " to " + toUser);
	 request.post(options, function(err, res, body) {
		if (err){
			 callback(err,null);
			 return;
		    }
		if (res.statusCode == 200 || res.statusCode == 201) {
		     callback(null, res.body);
		     return;
		    }
		    return;
		  });
};

/*User.savemyStatus = function(user_name, my_Status, callback) {
	  console.log("sending status");
	  var options = {
	    url : rest_api.post_new_status + user_name + '/updatestatus',
	    body : {userName: user_name, status: my_Status},
	    json: true
	  };
	  
	  request.post(options, function(err, res, body) {
		    if (err){
		      callback(err,null);
		      return;
		    }
		    if (res.statusCode == 200 || res.statusCode == 201) {
		      callback(null, res.body);
		      return;
		    }
		    return;
		  });
};
*/
module.exports = Chat;
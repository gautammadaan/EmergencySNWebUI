var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Wall(from_user, to_user, message, time, location){
	this = {
			from_userName : user_name,
			to_userName	:	to_user,
			message 		: message,
			message_timestamp:	time,
			location		: location
	};
}

Wall.getWallUpdates = function (callback){
	request(rest_api.get_wall, {json:true}, function(err, res, body){
		if (err !== null || res.statusCode !== 200)
		{
			callback(null, err);
			return;
		}
		else if (err === null && res.statusCode === 200)
		{   
			callback(res.body, null);
			return;
		}

	});
};

Wall.postWallMessage = function (user, message, callback){
//	post message to the database
	var options = {
			url : rest_api.post_on_wall + '/' + user,
			body : { from_userName: user, message: message },
			json: true
	};

	request.post(options, function(err, res, body) {
		if (err){
			callback(err, null);
			return;
		}
		if (res.statusCode !== 200 && res.statusCode !== 201) {
			callback(res.body, null);
			return;
		}
		callback(null, res.statusCode);
		return;
	});
};

Wall.getAnnouncement = function (callback){
	request(rest_api.get_announcement, {json:true}, function(err, res, body){
		if (err !== null || res.statusCode !== 200)
		{
			callback(null, err);
			return;
		}
		else if (err === null && res.statusCode === 200)
		{   
			callback(res.body, null);
			return;
		}
	});
};

Wall.postAnnouncement = function (user, message, callback){
//	post message to the database
	var options = {
			url : rest_api.post_announcement,
			body : { from_userName: user, message: message },
			json: true
	};

	request.post(options, function(err, res, body) {
		if (err){
			callback(err, null);
			return;
		}
		if (res.statusCode !== 200 && res.statusCode !== 201) {
			callback(res.body, null);
			return;
		}
		callback(null, res.statusCode);
		return;
	});
}

module.exports = Wall;
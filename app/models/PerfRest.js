var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Perf(get_perf, post_perf){
	this.local = {
			performance_post : post_perf,
			peformance_get : get_perf
	};
}

Perf.setupPerfSys = function(callback){
//	Post request to setup test Database
	var options = {
			url : rest_api.testPerformance + '/setup',
			json: true
	};
	request.post(options, function(err, res, body) {
		if(err === null)
			callback(null);
		else
			callback(err);
	});
};

Perf.resetTestData = function(callback){
//	Post request to setup test Database
	var options = {
			url : rest_api.testPerformance + '/resetTestDB',
			json: true
	};
	request.post(options, function(err, res, body) {
		if(err === null)
			callback(null, res);
		else
			callback(err, null);
	});
};

Perf.getWallPostPerf = function(duration, time_elapsed, no_req, stopSgnl, callback){

//	Check POST Performance
	var wall_message = {
			from_userName: 'test',
			to_userName:	'test',
			message:	'Hello!! World!!',
			message_timestamp:	'',
			location:	''
	};
	var options = {
			url : rest_api.testPerformance + '/testpost',
			body : { from_userName: 'test', message: wall_message },
			json: true
	};
	var start_date = new Date();
	var start_time = start_date.getTime();

	request.post(options, function(err, res, body) {
		if (err === null && res.statusCode === 200)
		{
			no_req = no_req + 1;
			var end_date = new Date();
			var end_time = end_date.getTime();	//time is in milliseconds
			time_elapsed = time_elapsed + end_time - start_time;

			if(time_elapsed >= duration || no_req >= 1000){
//				end this cycle and get back the result
				post_perf = parseInt(no_req / (time_elapsed / 1000));
				callback(null, post_perf);
				return;
			}
			else
			{
				Perf.getWallPostPerf(duration, time_elapsed, no_req, stopSgnl, callback);
			}
		}
	});

};

Perf.getWallGetPerf = function(duration, time_elapsed, no_req, stopSgnl, callback){

//	Start GET Performance Testing
	var start_date = new Date();
	var start_time = start_date.getTime();

	request(rest_api.get_wall, {json:true}, function(err, res, body){
		if (err === null && res.statusCode === 200)
		{   
			no_req = no_req + 1;
			var end_date = new Date();
			var end_time = end_date.getTime();
			time_elapsed = time_elapsed + end_time - start_time;

			if(time_elapsed >= duration || no_req >= 1000){
//				end this cycle and get back the result
				get_perf = parseInt(no_req / (time_elapsed / 1000));
				Perf.resetTestData(callback);
				callback(null, get_perf);
				return;
			}
			else
			{
				Perf.getWallGetPerf(duration, time_elapsed, no_req, stopSgnl, callback);
			}
		}
	});
};

// Analyze Social Network
Perf.analyzeSocialNetwork = function(duration, callback){
//	Send a get request for testing social network
	var options = {
			url : rest_api.anlyseNetwork + "/network/" + duration,
			body : { duration : duration },
			json: true
	};
	request.post(options, function(err, res){
		if(err !== null)
			callback(err, null);
		else if(err === null && res.statusCode === 200)
			callback(null, res.body);
		else
			callback(err, "");
	});
}

module.exports = Perf;

var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Search(){

}

Search.searchByUser = function(search_txt, callback) {
	var options = {
			url : rest_api.search + '/user/' + search_txt,
			json: true
	};
	request.post(options, function(err, res) {
			callback(err, res);
			return;
	});
};

Search.searchByStatus = function(search_txt, callback) {
	var options = {
			url : rest_api.search + '/status/' + search_txt,
			json: true
	};
	request.post(options, function(err, res, body) {
			callback(null, res);
			return;
	});
};

Search.searchPubMsg = function(search_txt, callback) {
	var options = {
			url : rest_api.search + '/publicMessages/' + search_txt,
			json: true
	};
	request.post(options, function(err, res, body) {
			callback(err, res);
			return;
	});
};

Search.searchAnnouncement = function(search_txt, callback) {
	var options = {
			url : rest_api.search + '/publicAnnouncement/' + search_txt,
			json: true
	};
	request.post(options, function(err, res, body) {
			callback(err, res);
	});
};

Search.searchChats = function(search_txt, callback) {
	var options = {
			url : rest_api.search + '/privateMessages/' + search_txt,
			json: true
	};
	request.post(options, function(err, res, body) {
			callback(err, res);
			return;
	});
};

module.exports = Search; 
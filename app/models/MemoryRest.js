var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Memory(createdAt, usedVolatile, freeVolatile, usedNonVolatile, freeNonVolatile){
  this.local = {
    createdAt : createdAt,
    usedVolatile : usedVolatile,
    freeVolatile : freeVolatile,
    usedNonVolatile : usedNonVolatile,
    freeNonVolatile : freeNonVolatile,
//    minutes : minutes
  };
}

Memory.startMemory = function(callback) {
	 var url = rest_api.memory_start;

	 var options = {
	   url : url,
	   body : {},
	   json: true
	 };

	 request.post(options, function(err, res, body) {

	   if (err){
	     callback(err);
	     return;
	   }

	   if (res.statusCode !== 201) {
	     callback(res.body);
	     return;
	   }

	   callback(null);
	   return;
	 });
	};

	Memory.stopMemory = function(callback) {

	   var url = rest_api.memory_stop;

	   request.post(url, {json:true}, function(err, res, body) {

	       if (err){
	           callback(err);
	           return;
	       }

	       if (res.statusCode !== 200) {
	           callback(null);
	           return;
	       }

	   callback(null,null);
	   return;

	   });
	};

	Memory.getMemory = function(callback) {

	   var url = rest_api.get_memory;

	   request.get(url, {json:true}, function(err, res, body) {
	       
		   if (err){
	           console.log('err on getMemory');
	           callback(err,null);
	           return;
	       }

	       if (res.statusCode !== 200) {
	    	   console.log('!== 200 on getMemory');
	    	   callback(null, null);
	           return;
	       }

	       var memory = body.map(function(item, idx, arr){
	           return new Memory(item.createdAt, item.usedVolatile, item.freeVolatile, item.usedNonVolatile, item.freeNonVolatile);
	       });

	       callback(null, memory);
	       return;

	   });
	};
	
	Memory.deleteMemory = function(callback) {
		 var url = rest_api.delete_memory;

		 var options = {
		   url : url,
		   body : {},
		   json: true
		 };

		 request.delete(options, function(err, res, body) {

		   if (err){
		     callback(err);
		     return;
		   }

		   if (res.statusCode !== 201) {
		     callback(res.body);
		     return;
		   }

		   callback(null);
		   return;
		 });
		};

	Memory.getMemoryTime = function(time, callback) {

	   var url = rest_api.memory_time_window_in_hours +time ;

	   request.get(url, {json:true}, function(err, res, body) {
	       if (err){
	           callback(err,null);
	           return;
	       }

	       if (res.statusCode !== 200) {
	           callback(null, null);
	           return;
	       }

	       var memory = body.map(function(item, idx, arr){
	    	   return new Memory(item.time, item.usedVolatile, item.freeVolatile, item.usedNonVolatile, item.freeNonVolatile);
	       });

	       callback(null, memory);
	       return;

	   });
	};

	module.exports = Memory;
	
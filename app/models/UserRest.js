var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function User(user_name, status, flag, profession, role, accountStatus, lat, long){
	this.local = {
			name : user_name,
			status : status,
			flag : flag,
			profession : profession,
			role : role,
			accountStatus : accountStatus,
			latitude	:	lat,
			longitude	:	long
	};
}

User.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.prototype.isValidPassword = function(password, callback) {
	request.post(rest_api.is_password_valid + this.local.name + '/authenticate', {json:true, body:{password:password}}, function(err, res, body) {
		if (err || res.statusCode !== 200){
			callback(false);
			return;
		}

		callback(true);
	});
};

User.getUser = function(user_name, callback) {
	request(rest_api.get_user + user_name, {json:true}, function(err, res, body) {
		if (err){
			callback(err,null);
			return;
		}
		if (res.statusCode === 200) {
			var user = new User(body.userName,"","","","","", body.latitude, body.longitude);
			callback(null, user);
			return;
		}
		if (res.statusCode !== 200) {
			callback(null, null);
			return;
		}
	});
};

User.getAllUsers = function(callback) {
	request(rest_api.get_all_users, {json:true}, function(err, res, body) {
		if (err){
			callback(err,null);
			return;
		}
		if (res.statusCode === 200) {
			var users = body.map(function(item, idx, arr){
				return new User(item.userName,item.status, 0, item.profession, item.role,item.accountStatus, item.latitude, item.longitude);//
			});

			users.sort(function(a,b) {
				return a.userName > b.userName;
			});

			console.log("@@@@@ in User.getAllUser succeed users :" + JSON.stringify(users));
			callback(null, users);
			return;
		}
		if (res.statusCode !== 200) {
			callback(null, null);
			return;
		}
	});
};

User.saveNewUser = function(user_name, password, profession, callback) {
	var options = {
			url : rest_api.post_new_user,
			body : {userName: user_name, password: password, profession: profession},
			json: true
	};

	request.post(options, function(err, res, body) {
		if (err){
			callback(err,null);
			return;
		}
		if (res.statusCode !== 200 && res.statusCode !== 201) {
			callback(res.body, null);
			return;
		}
		var new_user = new User(body.userName, password, undefined, profession);
		callback(null, new_user);
		return;
	});
};

User.savemyStatus = function(user_name, my_Status, callback) {
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

//Update User Profile
User.updateUserProfile = function(user_name,user_name_new,user_password,account_status,user_role,latitude, longitude, callback){
	var options = {
			url : rest_api.put_userupdate + user_name,
			body : { userName:user_name_new, password:user_password, role:user_role, accountStatus:account_status, 
				latitude: latitude, longitude: longitude },//
				json:true
	};
	request.put(options, function(err, res, body) {
		if (err) {
			callback(err, null);
			return;
		}
		if (res.statusCode == 200 || res.statusCode == 201) {
			console.log("update success");
			callback(null, res.body);
			return;
		}
		return;
	});
};

module.exports = User;

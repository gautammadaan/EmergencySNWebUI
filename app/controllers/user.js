var User = require('../models/UserRest');

module.exports = function(_, io, participants, passport, refreshAllUsers) {
	return {
		getLogin : function(req, res) {
			res.render("join", {message: req.flash('loginMessage')});
		},

		getLogout : function(req, res) {
			req.logout();
			res.redirect('/');
		},

		getSignup : function(req, res) {
			res.render('signup', {message: req.flash('signupMessage')});
		},

		getUser : function(req, res) {
			var user_name = req.session.passport.user.user_name;
			User.getUser(user_name, function(err, user) {
				if (user !== null) {
					res.json(200, {name:user.local.name, 
						latitude: user.local.latitude, longitude: user.local.longitude});
				}
			});
		},

//		Update User Profile
		updateProfile : function(req,res){
			User.updateUserProfile(req.body.user_name,req.body.user_name_new,req.body.user_password,req.body.account_status,req.body.user_role,0.0,0.0,function(err, updateProfile){
				if (updateProfile !== null){
					//Has Update Profile
					console.log("Has updated profile");
					for(var sId in participants.all){
						if(participants.all[sId].userName == req.body.user_name){
							participants.all[sId].userName = req.body.user_name_new;
							participants.all[sId].accountStatus = req.body.account_status;
							participants.all[sId].role = req.body.user_role;
						} 
					}
					for(var sId in participants.online){
						if(participants.online[sId].userName == req.body.user_name){
							participants.online[sId].userName = req.body.user_name_new;
							participants.online[sId].accountStatus = req.body.account_status;
							participants.online[sId].role = req.body.user_role;
						}
					}
					io.sockets.emit('callList', {participants:participants});
					res.redirect('/people');
				}
			});
		},

		myStatus : function(req, res) {
			User.savemyStatus(req.session.passport.user.user_name, req.body.myStatus, function(err, myStatus) {
				if (myStatus !== null)
				{
//					myStatus has response
					for(var sId in participants.all){
						if(participants.all[sId].userName == req.session.passport.user.user_name){
							participants.all[sId].status = req.body.myStatus;
						}
					}
					for(var sId in participants.online){
						if(participants.online[sId].userName == req.session.passport.user.user_name){
							participants.online[sId].status = req.body.myStatus;
						}
					}
					console.log(req.body.myStatus);
					if(req.body.myStatus == "Emergency"){
						res.redirect('/help');
					}
					else {
						res.redirect('/people');
					}
				}
			});
		},

		postSignup : function(req, res, next) {
			passport.authenticate('local-signup', function(err, user, info) {
				if (err)
					return next(err);
				if (!user)
					return res.redirect('/signup');
				req.logIn(user, function(err) {
					if (err)
						return next(err);

					participants.all.push({'userName' : user.local.name, 'role' : "Citizen", 
						'accountStatus' : "Active", 'profession' : user.local.profession});
					return res.redirect('/welcome');
				});
			})(req, res, next);
		},

		getWelcome : function(req, res) {
			res.render('welcome', {title: "Hello " + req.session.passport.user.user_name + " !!"} );
		},

		getMap : function(req, res) {
			console.log("participants\n\n..........." + participants.online);
			res.render('map', {participants: participants.online});
		}
	};
};

var Wall = require('../models/WallRest');

module.exports = function(_, io, passport) 
{
	return{
		getWall: function(req, res){
					res.render('public_wall', {user_name:req.session.passport.user.user_name});
		},
		
//		Call the model for wall to hit database
		postWallMessage: function(req, res){
			console.log(req.body);
			Wall.postWallMessage(req.session.passport.user.user_name, req.body.ta_postwall,  function(err, status){
					if(status !== null)
						res.render('public_wall', {user_name:req.session.passport.user.user_name});
			})
		},
		
		postAnnouncementMessage: function(req, res){
			console.log(req.body);
			Wall.postAnnouncement(req.session.passport.user.user_name, req.body.ta_postAnnouncement, function(err, status){
					if(status !== null)
						res.render('public_wall', {user_name:req.session.passport.user.user_name});
			})
		}
	};
};

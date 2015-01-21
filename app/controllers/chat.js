var Chat = require('../models/ChatRest');

module.exports = function(_, io, passport, chats)//, refreshWall) 
{
	return{
		getChatUpdates: function(req, res){
			res.render('chat');
		},
		
		startChats:function(req, res){
/*			Chat.getChatUpdates(req.session.passport.user.user_name, req.body.submitclicked, function(err, messages, users){
				if(messages !== null){
					messages.forEach(function(message) {
						//need to modify
						chats.message.push({'to_userName' : message.to_userName, 'from_userName' : message.from_userName, 'message' : message.message, 
								'message_timestamp' : message.message_timestamp, 'location': message.location});
					});
					users.forEach(function(user){
						//need to modify
						chats.user.push({userName : user.userName});
					})
				}
			});*/
			console.log("go to chat");
			if(chats !== undefined){
				var num = chats.user.length;
				for(var i = 0;i < num;i ++){
					var temp = chats.user.shift();
					if(temp.to_user != req.session.passport.user.user_name){
						chats.user.push(temp);
					}
				}
			}
			res.render('chat', {to_user: req.body.submitclicked, user_name:req.session.passport.user.user_name});
		},
	
		postChat: function(req,res){
			Chat.postMessage(req.session.passport.user.user_name, req.body.target_user, req.body.chatInput, function(err, res){
			});
			chats.user.push({from_user: req.session.passport.user.user_name, to_user: req.body.target_user});
			res.redirect('/people');
		}
	};
};
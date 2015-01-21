var Search = require('../models/SearchRest');

module.exports = function(_, io) 
{
	return{
		
		//		Call the model for wall to hit database
		getSearchResult: function(req, res){
			var search_cri = req.body.option;
			var search_txt = req.body.search_text;
			var search_status = req.body.optionStatus;
			console.log(search_status);
			
//			search users by username
			if(search_cri == "user")
				Search.searchByUser(search_txt, function(err, result){
					if(err == null && res.statusCode === 200){
						res.render("search", {users: result.body, messages: undefined});
					}
					else
						res.render("search", {users: undefined, messages: undefined});
				});
			
//			search users by status
			else if (search_cri == "status")
				Search.searchByStatus(search_status, function(err, result){
					if(err == null && res.statusCode === 200){
						console.log(result.body);
						res.render("search", {users: result.body, messages: undefined});
					}
					else
						res.render("search", {users: undefined, messages: undefined});
				});
			
//			search public wall messages
			else if (search_cri == "pub_mesg")
				Search.searchPubMsg(search_txt, function(err, result){
					if(err == null && res.statusCode === 200)
						res.render("search", {users: undefined, messages: result.body});
					else
						res.render("search", {users: undefined, messages: undefined});
				});
			
//			search public announcements
			else if (search_cri == "announce")
				Search.searchAnnouncement(search_txt, function(err, result){
					if(err == null && res.statusCode === 200)
						res.render("search", {users: undefined, messages: result.body});
					else
						res.render("search", {users: undefined, messages: undefined});
				});
				
//			search private chats
			else if (search_cri == "chats")
				Search.searchChats(search_txt, function(err, result){
					if(err == null && res.statusCode === 200)
						res.render("search", {users: undefined, messages: result.body});
					else
						res.render("search", {users: undefined, messages: undefined});
				});

		},
		
		getSearch:	function(req, res){
			res.render("search");
		}
	
	};
};

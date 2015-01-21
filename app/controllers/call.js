
module.exports = function(_, io, passport, participants, videoChats){
	return{
		postCall : function(req, res){
			videoChats.alerts.push(req.body.submitclicked);
			res.render('call');
		},
		
		getCall : function(req, res){
			if(videoChats.alerts !== undefined){
				var num = videoChats.alerts.length;
				for(var i = 0;i < num;i ++){
					var temp = videoChats.alerts.shift();
					if(temp != req.session.passport.user.user_name){
						videoChats.alerts.push(temp);
					}
				}
			}
			res.render('call');
		},
		
		getHelp : function(req, res){
			res.render('help');
		},
		
		getCallList : function(req, res){
			var list = [];
			var lo = 0, la = 0;
			for(var sId in participants.online){
				if(participants.online[sId].user_name == req.session.passport.user.user_name){
					lo = participants.online[sId].longitude;
					la = participants.online[sId].latitude;
				}
				list.push(participants.online[sId]);
			}
			for (var i = 0;i < list.length;i ++){
				var max = -1;
				var pin = 0;
				for(var j = i;j < list.length;j ++){
					var templo = list[j].longitude;
					var templa = list[j].latitude;
					var location = (lo-templo)^2 + (la-templa)^2;
					if(max == -1){
						max = location;
						pin = j;
					}
					if(location < max){
						max = location;
						pin = j;
					}
				}
				var temp = list[i];
				list[i] = list[pin];
				list[pin] = temp;
			}
			res.render('callList', {user:req.session.passport.user.user_name, condition: req.params, participants: list});
		}
	};
};
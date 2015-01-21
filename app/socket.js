var Wall = require('./models/WallRest')
var Chat = require('./models/ChatRest')
var User = require('./models/UserRest')

module.exports = function(_, io, participants, messages, chats, announcements, videoChats) {
	io.on("connection", function(socket){
		socket.on("newUser", function(data) {
			var status;
			var profession;
			var role;
			var accountStatus; var latitude = data.latitude; var longitude = data.longitude;
			for(var sId in participants.all){
				if(participants.all[sId].userName == data.name){
					status = participants.all[sId].status;
					profession = participants.all[sId].profession;
					role = participants.all[sId].role;
					accountStatus = participants.all[sId].accountStatus;
//					Update location if unavailable
					if(latitude != "" && longitude != ""){
						if(participants.all[sId].latitude != latitude || participants.all[sId].longitude != longitude){
							User.updateUserProfile(data.name, data.name, "", accountStatus, role, 
									latitude, longitude, function(err, updateProfile){
//								Do Nothing
								participants.all[sId].latitude = latitude;
								participants.all[sId].longitude = longitude;								
							});
						}
					}
					break;
				}
			}
			participants.online[data.id] = {'userName' : data.name, 'status': status, 'profession':profession, 'role':role, 'accountStatus':accountStatus, 
					'latitude': latitude, 'longitude' : longitude};
			io.sockets.emit("newConnection", {participants: participants, chatUser: chats, videoChats: videoChats.alerts});
		});

		socket.on("disconnect", function() {
			delete participants.online[socket.id];
			io.sockets.emit("userDisconnected", {id: socket.id, sender:"system", participants:participants});
		});

		Wall.getWallUpdates(function(wall, err){
			messages._public = [];
			wall.forEach(function(wall) {
				messages._public.push({'to_userName' : wall.to_userName, 'from_userName' : wall.from_userName, 'message' : wall.message, 
					'message_timestamp' : wall.message_timestamp, 'location': wall.location});
			});
			io.sockets.emit("messages", messages);
		});

		Wall.getAnnouncement(function(announcement, err){
			announcements.message = [];
			announcement.forEach(function(announcement) {
				announcements.message.push({'to_userName' : announcement.to_userName, 'from_userName' : announcement.from_userName, 'message' : announcement.message, 
					'message_timestamp' : announcement.message_timestamp, 'location': announcement.location});
			});
			io.sockets.emit("announcement", {announcement: announcements, participants:participants});
		});

		socket.on("startChat", function(data){
			var num = chats.message.length;
			for(var i = 0;i < num;i ++){
				var temp = chats.message.shift();
				if(data.user1 != temp.from_userName || data.user2 != temp.to_userName){
					chats.message.push(temp);
				}
			}
			Chat.getChatUpdates(data.user1, data.user2, function(err, messages, users){
				chats.message = [];
				messages.forEach(function(message) {
					//need to modify
					chats.message.push({'to_userName' : message.to_userName, 'from_userName' : message.from_userName, 'message' : message.message, 
						'message_timestamp' : message.message_timestamp, 'location': message.location});
				});
				io.sockets.emit("chats",  {chats: chats, participants: participants});
			});
		});

		socket.on('__join', function(data){
			videoChats.sockets.push(socket);
			console.log("__join");
			var ids = [],
			i,m,
			room = data.room || 0,
			curSocket,
			curRoom;
			curRoom = videoChats.rooms[room] = videoChats.rooms[room] || [];

			for(i = 0, m = curRoom.length;i < m;i ++){
				curSocket = curRoom[i];
				if(curSocket.id === socket.id){
					continue;
				}
				ids.push(curSocket.id);
			}
			socket.on('streamReady', function(){
				io.sockets.emit('_new_peer', {socketId : data.socketId});
			});
			curRoom.push(socket);
			socket.room = room;

			socket.emit('_peers', {connections : ids, you : socket.id});
		});

		socket.on('__ice_candidate', function(data){
			var soc = getSocket(data.socketId);
			if(soc){
				soc.emit('_ice_candidate', {label : data.label, candidate : data.candidate, socketId : socket.id});
			}
		});

		socket.on('__offer', function(data){
			var soc = getSocket(data.socketId);
			console.log("offer server");
			console.log('soc:' + soc);
			if(soc){
				soc.emit('_offer', {sdp : data.sdp, socketId : socket.id});
			}
		});
		socket.on('__answer', function(data){
			var soc = getSocket(data.socketId);
			if(soc){
				soc.emit('_answer', {sdp : data.sdp, socketId : socket.id});
			}
		});
		socket.on('endcall', function(data){
			var i, m,
			room = socket.room,
			curRoom;
			io.sockets.emit('_remove_peer', {socketId : socket.id});
			for(var sId in videoChats.sockets){
				if(videoChats.sockets[sId].id == socket.id){
					continue;
				}
				videoChats.sockets.push(videoChats.sockets[sId]);
			}
		});
	});
	function getSocket(id){
		var i, curSocket;
		if(!videoChats.sockets){
			return;
		}
		for(i = videoChats.sockets.length; i--;){
			curSocket = videoChats.sockets[i];
			if(id == curSocket.id){
				return curSocket;
			}
		}
	}
};

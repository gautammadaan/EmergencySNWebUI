function init() {
	var to_user = document.getElementById('to_user').value;
	var from_user = document.getElementById('from_user').value;
	
	var serverBaseUrl = document.domain;

	var socket = io.connect(serverBaseUrl);

	var sessionId = '';

	window.targetName = '';

	function updateChat(messages, participants)
	{
		$('#chatList').html('');
		var myStatus;
		var yourStatus;
		for(var sId in participants.all){
			if(participants.all[sId].userName == to_user){
				yourStatus  = participants.all[sId].status;
			}
			if(participants.all[sId].userName == from_user){
				myStatus = participants.all[sId].status;
			}
		}
		messages.forEach(function(messageObj)
		{
			var ts = messageObj.message_timestamp.split("T");
			var time = ts[1].split(".",1);
			var date = ts[0].split("-");
			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			var month = months.slice(date[1]-1,date[1]);
			var div1 = '<div class="col-xs-10 col-sm-10 col-md-9 col-lg-9">';
			if(messageObj.from_userName == from_user && messageObj.to_userName == to_user){
				var div1_ele1 = '<label>' + messageObj.from_userName + '</label>';
				var div1_ele2 = ' (status: ' + '<label>' + myStatus + '</label>' + ')' + '<br>';
				var div1_ele3 = '<label> ' + messageObj.message + '</label>' + ' on ' + month + ' ' + date[2] + ', '+ date[0] + ' @ ' + time;
			}
			if(messageObj.from_userName == to_user && messageObj.to_userName == from_user){
				var div1_ele1 = '<label>' + messageObj.from_userName + '</label>';
				var div1_ele2 = ' (status: ' + '<label>' + yourStatus + '</label>' + ')' + '<br>';
				var div1_ele3 = '<label>' + messageObj.message + '</label>' + ' on ' + month + ' ' + date[2] + ', '+ date[0] + ' @ ' + time;	
			}
			var message_row = '<div class = "row">' + div1 + div1_ele1 + div1_ele2 + div1_ele3 + '</div></div>';
			$('#chatList').append(message_row);
		});
	}
	 socket.emit('startChat', {user1: from_user, user2: to_user});
	
	socket.on('chats', function (data) {
		updateChat(data.chats.message, data.participants);
	});

	socket.on('error', function (reason) {
		console.log('Unable to connect to server', reason);
	});

}

$(document).on('ready', init);

function init() {
	var serverBaseUrl = document.domain;

	var socket = io.connect(serverBaseUrl);

	var sessionId = '';

	window.my_name = '';

//	updateWall(wall_messages);
	function updateWall(messages)
	{
		$('#wall').html('');
		messages.forEach(function(messageObj)
		{
//			This if is to prevent any status updates of Admin
			if(!(messageObj.from_userName === messageObj.to_userName 
					&& messageObj.from_userName === "SSNAdmin"))
			{
				var ts = messageObj.message_timestamp.split("T");
				var time = ts[1].split(".",1);
				var date = ts[0].split("-");
				var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				var month = months.slice(date[1]-1,date[1]);
				var div1 = '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
				var div1_ele1 = '<label>' + messageObj.from_userName + '</label>' + '<br>';
				var div1_ele2 = ' on ' + month + ' ' + date[2] + ', '+ date[0] + ' @ ' + time + '<br>';
				if (messageObj.from_userName === messageObj.to_userName)
					var div1_ele3 = 'Updated his status to -- ' + '<label>' + messageObj.message + '</label>';
				else if (messageObj.from_userName !== messageObj.to_userName)
					var div1_ele3 = '<label>' + messageObj.message + '</label>';

				var message_row = '<div class = "row">' + div1 + div1_ele1 + ' ' + div1_ele3 + div1_ele2 + '</div></div>';
				$('#wall').append(message_row);
			}
		});
	}
	
	function updateAnnouncement(announcements, participants){
		var userName = document.getElementById('user_name').value;
		var myRole = "";
		var mystatus = "";
		$('#announcement').html("");
		for (var sId in participants.all){
	    	if(userName == participants.all[sId].userName){
	    		myStatus = participants.all[sId].status;
	    		myRole = participants.all[sId].role;
	    	}
	    }
		if(myRole != "Administrator" && myRole != "Coordinator"){
			$('#announcementInput').hide();
		}
		announcements.forEach(function(announcementObj)
		{
			var ts = announcementObj.message_timestamp.split("T");
			var time = ts[1].split(".",1);
			var date = ts[0].split("-");
			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			var month = months.slice(date[1]-1,date[1]);
			var div1 = '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
			var div1_ele1 = '<label>' + announcementObj.to_userName + '</label>' + '<br>';
			var div1_ele2 = ' on ' + month + ' ' + date[2] + ', '+ date[0] + ' @ ' + time + '<br>';
			var div1_ele3 = '<label>' + announcementObj.message + '</label>';

			var message_row = '<div class = "row">' + div1 + div1_ele1 + ' ' + div1_ele3 + div1_ele2 + '</div></div>';
			$('#announcement').append(message_row);
		});
	}

	socket.on('connect', function () {
		sessionId = socket.socket.sessionid;
		$.ajax({
			url:  '/user',
			type: 'GET',
			dataType: 'json'
		}).done(function(data) {
			var name = data.name;
			my_name = data.name;
			if(window.name != "locationUpdated"){
				window.name = "locationUpdated";
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position){
						var lat = position.coords.latitude.toFixed(4);
						var long = position.coords.longitude.toFixed(4);
						socket.emit('newUser', {id: sessionId, name: name, latitude: lat, longitude: long});
					});
				}
			}
			else
				socket.emit('newUser', {id: sessionId, name: name, latitude: data.latitude, longitude: data.longitude});
		});
	});
	
	socket.on('messages', function (data) {
		updateWall(data._public);
	});

	socket.on("announcement", function(data){
		updateAnnouncement(data.announcement.message, data.participants);
	});
	
	socket.on('error', function (reason) {
		console.log('Unable to connect to server', reason);
	});

}

$(document).on('ready', init);
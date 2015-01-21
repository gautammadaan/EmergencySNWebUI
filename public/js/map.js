
var serverBaseUrl = document.domain;
var socket = io.connect(serverBaseUrl);

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
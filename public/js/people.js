var serverBaseUrl = document.domain;
var socket = io.connect(serverBaseUrl);
var locationChanged = 1;
function init() {

	var sessionId = '';

	window.my_name = '';

	var myRole = '';
	var myStatus = '';

	function updateParticipants(participants, chatUser, videoChats) {
		$('#participants_online').html('');
		$('#participants_offline').html('');
		var map = {};
		var userName = '';
		var status = '';
		var userEle = '';
		var lat = ''; var long = '';
		var image_status = document.getElementById("img_status");
		var temp = 0;
		for (var sId in participants.all){
			if(my_name == participants.all[sId].userName){
				myStatus = participants.all[sId].status;
				myRole = participants.all[sId].role;
			}
		}
		if(myStatus == "OK")
		{
			image_status.src = "/img/OK.png";
		}
		else if(myStatus == "Help")
		{
			image_status.src = "/img/Help.png";
		}
		else if(myStatus == "Emergency")
		{
			image_status.src = "/img/Emergency.png";
		}
		else
		{
			image_status.src = "/img/grey-dot2.png";
		}
		for (var sId in participants.online){
			userName = participants.online[sId].userName;
			if (map[userName] == undefined || map[userName] !== sessionId){
				map[userName] = {sId:sId};
			}
		}
		keys = Object.keys(map);
		keys.sort();

		for (var i = 0; i < keys.length; i++) {
			var name = keys[i];
			var status = '';
			var role ='';
			var accountStatus ='';
			for (var sId in participants.online){
				if(name == participants.online[sId].userName){
					status = participants.online[sId].status;
					role = participants.online[sId].role;
					accountStatus = participants.online[sId].accountStatus;
				}
			}
			var div_1 = '<div class = "col-xs-4 col-sm-4 col-md-5 col-lg-5">';
			var div_1_ele_1 = '<img src="/img/green-dot.png" height=10><br>';
			var img_ele = '<img src="/img/photo4.png" height=40/>';
			var div_1_ele_2 = img_ele;
			div_1 = div_1 + div_1_ele_1 + div_1_ele_2 + '</div>';

			var div_2 = '<div class = "col-xs-6 col-sm-6 col-md-5 col-lg-5">';
			if(status == "OK")
			{
				var img_status = '<img id = "img_status" src = "/img/OK.png" height=30>';
			}
			else if(status == "Help")
			{
				var img_status = '<img id = "img_status" src = "/img/Help.png" height=30>';
			}
			else if(status == "Emergency")
			{
				var img_status = '<img id = "img_status" src = "/img/Emergency.png" height=30>';
			}
			else
			{
				var img_status = '<img id = "img_status" src = "/img/grey-dot2.png" height=30>';
			}
			var div_2_ele_1 = '<br>' + img_status + '<br>';
			var div_2_ele_2 = '<label><strong>' + name +'</strong></label>'; 
			div_2 = div_2 + div_2_ele_1 + div_2_ele_2 + '</div>';

			var div_3 = '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><br>' + 
			'<button class = "submit" form = "chat_room" onclick="submitClick(this);" value = "' + name + '">Message</button><hr/>';      
			div_3 = div_3 + /*status_text*/'<br>'  + '</div>';

			var dropdown_symbol = map[name].sId === sessionId ? '':'<i class="glyphicon glyphicon-chevron-down text-muted"></i>';
			var dropdown_ele = '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 dropdown-user" data-for=".' + name + '">' + dropdown_symbol + '</div>';
			var submit_form = '<button id="updateBtn" class = "submit" form="'+ name +'" onclick = "validateUserNameAndPassword(this);">Submit</button><br>';
			var form_userprofile =  myRole === "Administrator" ? '<form id="'+ name +'" name="'+ name +'" action ="/update" method = "post">'
					+ '<input type="hidden" name="user_name" value="'+ name +'">'
					+ 'Name: <input type="text" name="user_name_new" id ="userName" value="'+ name +'">'
					+ 'Password: <input type="text" name="user_password" id="passwd" placeholder="password"><br>'
					+ 'Role: <select name="user_role">' + getRole(role) + '</select>'
					+ 'Account Status: <select name="account_status">' + getStatus(accountStatus) + '</select><br>'
					+ submit_form :''
						+ '</form><br>';
//					Update User Profile 
					var info_ele = '<br><div class="row user-row search_item">' + div_1 + div_2 + div_3 + dropdown_ele + '</div>';
					var detail_ele = '<div class="row user-info ' + name + '">'
					+ form_userprofile 
					+ '<hr/></div></div>';
					if (map[name].sId === sessionId || name === my_name) {
					} else {
						$('#participants_online').append(info_ele);
						$('#participants_online').append(detail_ele);
					}
		}

		participants.all.forEach(function(userObj) {
			if (map[userObj.userName] == undefined) {
				var div_1 = '<div class = "offline col-xs-4 col-sm-4 col-md-5 col-lg-5">';
				var div_1_ele_1 = '<img src="/img/green-dot.png" height=10><br>';
				var img_ele = '<img class = "img-circle" src="/img/photo4.png" height=40/>';
				var div_1_ele_2 = img_ele;
				div_1 = div_1 + div_1_ele_1 + div_1_ele_2 + '</div>';

				var div_2 = '<div class = "offline col-xs-6 col-sm-6 col-md-5 col-lg-5">';
				if(userObj.status == "OK")
				{
					var img_status = '<img id = "img_status" src = "/img/OK.png" height=30>';
				}
				else if(userObj.status == "Help")
				{
					var img_status = '<img id = "img_status" src = "/img/Help.png" height=30>';
				}
				else if(userObj.status == "Emergency")
				{
					var img_status = '<img id = "img_status" src = "/img/Emergency.png" height=30>';
				}
				else
				{
					var img_status = '<img id = "img_status" src = "/img/grey-dot2.png" height=30>';
				}
				var div_2_ele_1 = '<br>' + img_status + '<br>';
				var div_2_ele_2 = '<label><strong>' + userObj.userName +'</strong></label>'; 
				div_2 = div_2 + div_2_ele_1 + div_2_ele_2 + '</div>';

				var div_3 = '<div class="offline col-xs-2 col-sm-2 col-md-2 col-lg-2"><br>' +
				'<button form = "chat_room" onclick="submitClick(this);" value = "' + userObj.userName + '">Message</button>';

				div_3 = div_3 + /*status_text*/'<br>'  + '</div>';
				// onclick="submitClick(this);"
				var dropdown_ele = '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 dropdown-user" data-for=".' + userObj.userName + '"><i class="glyphicon glyphicon-chevron-down text-muted"></i></div>';
				var info_ele = '<br><div class="row user-row search_item">' + div_1 + div_2 + div_3 + dropdown_ele + '</div>';
				var submit_form = '<button id="updateBtn" form="' + userObj.userName + '" value = "ok" onclick = "validateUserNameAndPassword(this);">Submit</button><br>'; 
				var form_userprofile =  myRole === "Administrator" ? '<form id="' + userObj.userName + '" name="' + userObj.userName + '" action ="/update" method = "post">'
						+ '<input type="hidden" name="user_name" value="'+ userObj.userName +'">'
						+ 'Name: <input type="text" name="user_name_new" id="userName" value="'+ userObj.userName +'">'
						+ 'Password: <input type="text" name="user_password" id="passwd" placeholder="password"><br>'
						+ 'Role: <select name="user_role">' + getRole(userObj.role) + '</select>'
						+ 'Account Status: <select name="account_status">' + getStatus(userObj.accountStatus) + '</select><br><br>'
						+ '</form><br>'
						+ submit_form:'';
						var detail_ele = '<div id="test" class="row user-info ' + userObj.userName + '">'
						+ form_userprofile 
						+ '</div></div>';
						$('#participants_offline').append(info_ele);
						$('#participants_offline').append(detail_ele);
			}
		});
		if(chatUser.user !==undefined){
			console.log(chatUser.user);
			for(var sId in chatUser.user){
				console.log(chatUser.user[sId].to_user);
				if(chatUser.user[sId].to_user === my_name){
					alert("you have a message from " + chatUser.user[sId].from_user);
				}
			}
		}
		if(videoChats !==undefined){
			for(var sId in videoChats){
				if(videoChats[sId] === my_name){
					var callAlert = document.getElementById('callBtn');
					callAlert.removeAttribute("class");
					callAlert.setAttribute("class","btn btn-sm");
				}
			}
		}
		$('.user-info').hide();
		$('.dropdown-user').click(function() {
			var dataFor = $(this).attr('data-for');
			var idFor = $(dataFor);
			var currentButton = $(this);
			idFor.slideToggle(400, function() {
				if(idFor.is(':visible'))
				{
					currentButton.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>');
				}
				else
				{
					currentButton.html('<i class="glyphicon glyphicon-chevron-down"></i>');
				}
			})
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

	socket.on('newConnection', function (data) {
		updateParticipants(data.participants, data.chatUser, data.videoChats);
	});

	socket.on('userDisconnected', function(data) {
		updateParticipants(data.participants);
	});

	socket.on('error', function (reason) {
		console.log('Unable to connect to server', reason);
	});

	var panels = $('.user-info');
	panels.hide();
	$('.dropdown-user').click(function() {
		var dataFor = $(this).attr('data-for');
		var idFor = $(dataFor);
		var currentButton = $(this);
		idFor.slideToggle(400, function() {
			if(idFor.is(':visible'))
			{
				currentButton.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>');
			}
			else
			{
				currentButton.html('<i class="glyphicon glyphicon-chevron-down text-muted"></i>');
			}
		})
	});
}

$(document).on('ready', init);

function changeStatus()
{
	console.log("changing status");
	var status = document.getElementById("myStatus");
	var image_status = document.getElementById("img_status");
	if(status.value == "OK")
	{
		status.removeAttribute("class");
		status.setAttribute("class","bg-primary");
		image_status.src = "/img/OK.png";
	}
	else if(status.value == "Help")
	{
		image_status.src = "/img/Help.png";
		status.removeAttribute("class");
		status.setAttribute("class","bg-warning");
	}
	else if(status.value == "Emergency")
	{
		image_status.src = "/img/Emergency.png";
		status.removeAttribute("class");
		status.setAttribute("class","bg-danger");
	}
	else
	{
		image_status.src = "/img/grey-dot2.png";
		status.removeAttribute("class");
		status.setAttribute("class","bg-info");
	}
}

function submitClick(button) {
	button.form.submitclicked.value = button.value;
}

function validateUserNameAndPassword(button) {
	var forbiddenUserName = ["about", "access", "account", "accounts", "add", "address", "adm", "admin", "administration", "adult",
	                         "advertising", "affiliate", "affiliates", "ajax", "analytics", "android", "anon", "anonymous",
	                         "api", "app", "apps", "archive", "atom", "auth", "authentication", "avatar",
	                         "backup", "banner", "banners", "bin", "billing", "blog", "blogs", "board", "bot", "bots", "business",
	                         "chat", "cache", "cadastro", "calendar", "campaign", "careers", "cgi", "client", "cliente", "code", "comercial",
	                         "compare", "config", "connect", "contact", "contest", "create", "code", "compras", "css",
	                         "dashboard", "data", "db", "design", "delete", "demo", "design", "designer", "dev", "devel", "dir",
	                         "directory", "doc", "docs", "domain", "download", "downloads",
	                         "edit", "editor", "email", "ecommerce",
	                         "forum", "forums", "faq", "favorite", "feed", "feedback", "flog", "follow", "file", "files", "free", "ftp",
	                         "gadget", "gadgets", "games", "guest", "group", "groups",
	                         "help", "home", "homepage", "host", "hosting", "hostname", "html", "http", "httpd", "https", "hpg",
	                         "info", "information", "image", "img", "images", "imap", "index", "invite", "intranet", "indice", "ipad", "iphone", "irc",
	                         "java", "javascript", "job", "jobs", "js",
	                         "knowledgebase",
	                         "log", "login", "logs", "logout", "list", "lists",
	                         "mail", "mail1", "mail2", "mail3", "mail4", "mail5", "mailer", "mailing", "mx", "manager", "marketing",
	                         "master", "me", "media", "message", "microblog", "microblogs", "mine", "mp3", "msg", "msn", "mysql",
	                         "messenger", "mob", "mobile", "movie", "movies", "music", "musicas", "my",
	                         "name", "named", "net", "network", "new", "news", "newsletter", "nick", "nickname", "notes", "noticias",
	                         "ns", "ns1", "ns2", "ns3", "ns4",
	                         "old", "online", "operator", "order", "orders",
	                         "page", "pager", "pages", "panel", "password", "perl", "pic", "pics", "photo", "photos", "photoalbum",
	                         "php", "plugin", "plugins", "pop", "pop3", "post", "postmaster",
	                         "postfix", "posts", "profile", "project", "projects", "promo", "pub", "public", "python",
	                         "random", "register", "registration", "root", "ruby", "rss",
	                         "sale", "sales", "sample", "samples", "script", "scripts", "secure", "send", "service", "shop",
	                         "sql", "signup", "signin", "search", "security", "settings", "setting", "setup", "site",
	                         "sites", "sitemap", "smtp", "soporte", "ssh", "stage", "staging", "start", "subscribe",
	                         "subdomain", "suporte", "support", "stat", "static", "stats", "status", "store", "stores", "system",
	                         "tablet", "tablets", "tech", "telnet", "test", "test1", "test2", "test3", "teste", "tests", "theme",
	                         "themes", "tmp", "todo", "task", "tasks", "tools", "tv", "talk",
	                         "update", "upload", "url", "user", "username", "usuario", "usage",
	                         "vendas", "video", "videos", "visitor",
	                         "win", "ww", "www", "www1", "www2", "www3", "www4", "www5", "www6", "www7", "wwww", "wws", "wwws", "web", "webmail",
	                         "website", "websites", "webmaster", "workshop",
	                         "xxx", "xpg",
	                         "you", "yourname", "yourusername", "yoursite", "yourdomain"];
	var userName = button.form.user_name.value;
	var userNewName = button.form.user_name_new.value;
	var userPassword = button.form.user_password.value;

	var a =  forbiddenUserName.indexOf(userName);
	if (userNewName.length < 3) {
		alert("userName length should not be under 3");
		return false;
	} else if (userPassword == "") {
		button.form.submit();
	} else if (userPassword.length < 4 && userPassword != "") {
		alert("password length should not be under 4");
		return false;
	} else if (a != -1) {
		alert("user name cannot be used");
		return false;
	}

}

//return the dropdown list for roles
function getRole(role){
	if(role === "Citizen"){
		var str = 	'<option value="Citizen">Citizen</option>' +
		'<option value="Monitor">Monitor</option>' +
		'<option value="Coordinator">Coordinator</option>' +
		'<option value="Administrator">Administrator</option>';
		return str;
	}
	if(role === "Administrator"){
		var str =	'<option value="Citizen">Citizen</option>'+
		'<option value="Monitor">Monitor</option>'+
		'<option value="Coordinator">Coordinator</option>'+
		'<option value="Administrator" selected = "selected">Administrator</option>'; 
		return str;
	}
	if(role === "Monitor"){
		var str =	'<option value="Citizen">Citizen</option>'+
		'<option value="Monitor" selected = "selected">Monitor</option>'+
		'<option value="Coordinator">Coordinator</option>' +
		'<option value="Administrator">Administrator</option>';
		return str;
	}
	if(role === "Coordinator"){
		var str =	'<option value="Citizen">Citizen</option>'+
		'<option value="Monitor">Monitor</option>'+
		'<option value="Coordinator" selected = "selected">Coordinator</option>' +
		'<option value="Administrator">Administrator</option>';
		return str;
	}
}

//return the dropdown list for Account Status
function getStatus(status){
	if(status === "Active"){
		var str = 	'<option value="Active">Active</option>' +
		'<option value="Inactive">Inactive</option>';
		return str;
	}
	if(status === "Inactive"){
		var str =	'<option value="Active">Active</option>'+
		'<option value="Inactive" selected = "selected">Inactive</option>';
		return str;
	}
}

// var serverBaseUrl = document.domain;
// var videos = document.getElementById("videos");
// var sendBtn = document.getElementById("sendBtn");
// var msgs = document.getElementById("msgs");
// var sendFileBtn = document.getElementById("sendFileBtn");
// var files = document.getElementById("files");
var serverBaseUrl = document.domain;
var socket = io.connect(serverBaseUrl);
var PeerConnection = (window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
var URL = (window.URL || window.webkitURL || window.msURL || window.oURL);
var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
var nativeRTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);
var nativeRTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription); // order is very important: "RTCSessionDescription" defined in Nighly but useless
var moz = !! navigator.mozGetUserMedia;
var iceServer = {
    "iceServers": [{
        "url": "stun:0.0.0.0:8098"
    }]
};
var packetSize = 1000;

var localMediaStream = null;
var room;
var peerConnections = {};
var connections = [];
var numStreams = 0;
var initializedStreams = 0;
init();
function init() {
    createStream();
    socket.on('connect', function(){
        room = 0;
        socket.emit('__join', {room : room, socketId : socket.socket.sessionid});
    });
    
    socket.on('error', function(reason){
        console.log('Unable to connect to server', reason);
    });
    
    socket.on('disconnect', function(){
        
        localMediaStream.close();
        var pcs = peerConnections;
        for (i = pcs.length; i--;) {
            closePeerConnection(pcs[i]);
        }
        peerConnections = [];
        connections = [];
        socket.emit('endcall', {});
    });
    
    socket.on('_peers', function(data){
        connections = data.connections;
    });

    socket.on('_ice_candidate', function(data) {
        var candidate = new nativeRTCIceCandidate(data);
        var pc = peerConnections[data.socketId];
        pc.addIceCandidate(candidate);
    });
    
    socket.on('_new_peer', function(data) {
        if(data.socketId != socket.id){
            console.log('newPeer!');
            console.log('my socketId:' + socket.socket.sessionid);
            console.log('other socketId:' + data.socketId);
            connections.push(data.socketId);
            var pc = createPeerConnection(data.socketId);
            pc.addStream(localMediaStream);
        }
    });
    
    socket.on('_remove_peer', function(data){
        var sendId;
        closePeerConnection(peerConnections[data.socketId]);
        delete peerConnections[data.socketId];
    });
    
    socket.on('_offer', function(data){
        receiveOffer(data.socketId, data.sdp);
    });
    
    socket.on('_answer', function(data){
        receiveAnswer(data.socketId, data.sdp);
    });
    
}


function createPeerConnection(socketId) {
    var that = this;
    var pc = new PeerConnection(iceServer);
    peerConnections[socketId] = pc;
    pc.onicecandidate = function(evt) {
        if (evt.candidate){
            socket.emit('__ice_candidate', {label : evt.candidate.sdpMLineIndex, candidate : evt.candidate.candidate, socketId : socketId});
        }
    };

    pc.onopen = function() {
    };
    
    pc.onaddstream = function(evt) {
        var newVideo = document.createElement("video"),
            id = "other-" + socketId;
        newVideo.setAttribute("class", "other");
        newVideo.setAttribute("width", "480");
        newVideo.setAttribute("height", "360");
        newVideo.setAttribute("autoplay", "autoplay");
        newVideo.setAttribute("id", socketId);
        videos.appendChild(newVideo);
        attachStream(evt.stream, socketId);
    };
    return pc;
}

function closePeerConnection(pc) {
    if(!pc)
        return;
    pc.close();
}

function receiveOffer(socketId, sdp){
    var pc = peerConnections[socketId];
    sendAnswer(socketId,sdp);
}

function sendAnswer(socketId, sdp){
    var pc = peerConnections[socketId];
    pc.setRemoteDescription(new nativeRTCSessionDescription(sdp));
    pc.createAnswer(function(session_desc) {
        pc.setLocalDescription(session_desc);
        socket.emit('__answer', {socketId : socketId, sdp : session_desc});
    });
}

function receiveAnswer(socketId, sdp){
    var pc = peerConnections[socketId];
    pc.setRemoteDescription(new nativeRTCSessionDescription(sdp));
}

function createPeerConnections(){
    var i, m;
    console.log("createPeerConnections");
    console.log(connections);
    for (i = 0, m = connections.length; i < m; i++) {
        createPeerConnection(connections[i]);
    }
}

function addStreams(stream){
    var i, m,
        stream,
        connection;
    for (connection in peerConnections) {
        console.log("addstreams" + peerConnections);
        peerConnections[connection].addStream(stream);
    }
}

function sendOffers(){
    var i, m,
        pc,
        pcCreateOfferCbGen = function(pc, socketId) {
            return function(session_desc) {
                pc.setLocalDescription(session_desc);
                socket.emit('__offer', {sdp : session_desc, socketId : socketId});
            };
        },
        pcCreateOfferErrorCb = function(error) {
            console.log(error);
        };
    for (i = 0, m = connections.length; i < m; i++) {
        pc = peerConnections[connections[i]];
        pc.createOffer(pcCreateOfferCbGen(pc, connections[i]), pcCreateOfferErrorCb);
    }
}

function createStream(){
    if(getUserMedia){
        numStreams ++;
        getUserMedia.call(navigator, {
            video : true,
            audio : true
            }, function(stream){
                localMediaStream = stream;
                initializedStreams ++;
                document.getElementById('me').src = URL.createObjectURL(stream);
                document.getElementById('me').play();
                if(initializedStreams === numStreams){
                    createPeerConnections();
                    addStreams(stream);
                    sendOffers();
                }
                socket.emit('streamReady');
        }, function(error){
            console.log("stream_create_error");
        });
    }else{
        console.log("stream_create_error2");
    }
}

function attachStream(stream, domId){
    var element = document.getElementById(domId);
    if (navigator.mozGetUserMedia) {
        element.mozSrcObject = stream;
        element.play();
    }
    element.src = webkitURL.createObjectURL(stream);
}

function addstream(pc, stream){
    
}

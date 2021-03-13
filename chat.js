var PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();
var path = require('path');
var http = require('http').Server(app);
const io = require('socket.io')(http);
const users = {};

app.get('/', (req,res) => {
	res.sendFile(__dirname + '/chat.html');
});
io.on('connection', (socket) => {

	socket.on('new-user', name => {
		users[socket.id] = name;
		socket.broadcast.emit('user-connected', name);
	});

	socket.on('send-chatmsg', message => {
	socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]} );
	});

	socket.on('disconnect', () => {
		socket.broadcast.emit('user-disconnected', users[socket.id]);
		delete users[socket.id];
	});

})

http.listen(PORT, function() {
	console.log("Server is running on port 5000");
})

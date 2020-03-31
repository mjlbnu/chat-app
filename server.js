const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', socket => {
  // Welcome current user
  socket.emit('message', 'Bem vindo ao chat!');

  // Broadcast when a user connects - apenas os demais usuários recebem
  socket.broadcast.emit('message', 'Um usuário entrou no chat!');

  // Runs when client disconnects - todos recebem
  socket.on('disconnect', () => {
    io.emit('message', 'Um usuário saiu do chat!');
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    io.emit('message', msg);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));

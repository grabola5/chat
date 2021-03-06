const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); //podpinamy socketIo do serwera
const UsersService = require('./UsersService');

const usersService = new UsersService();

app.use(express.static(`${__dirname}/public`));

app.get('/', (req,res) => {
  res.sendFile(`${__dirname}/index.html`);
});

//obsługa nowego użytkownika - socket reprezentuje osobę, która właśnie weszła
io.on('connection', (socket) => {
  //klient nasłuchuje na wiadomość wejścia do czatu
  socket.on('join', (name) => {
    //użytkownika, który się pojawił zapisujemy do serwisu z listą osób
    usersService.addUser({
      id: socket.id,
      name
    });
    //zdarzenie update aktualizuje info na temat listy każdemu nasłuchującemu
    io.emit('update', {
      users: usersService.getAllUsers()
    });
  });
});
  //obsługa przerwania połączenia
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    usersService.removeUser(socket.id);
    socket.broadcast.emit('update', {
      users: usersService.getAllUsers()
    });
  });
});

  //obsługa wysłania wiadomości
io.on('connection', (socket) => {
  socket.on('message', (message) => {
    const {name} = usersService.getUserById(socket.id);
    socket.broadcast.emit('message', {
      text: message.text,
      from: name
    });
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

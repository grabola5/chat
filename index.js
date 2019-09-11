const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); //podpinamy socketIo do serwera

app.use(express.static(`${_dirname}/public`));

app.get('/', (req,res) => {
  res.sendFile(`${_dirname}/index.html`);
});

server.listem(3000, () => {
  console.log('listening on *:3000');
});

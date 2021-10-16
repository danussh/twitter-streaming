const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors= require('cors');

const port = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = socketio(server);


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require('./routes/tweets.js')(app, io);

server.listen(port, () => {
    console.log('server is up');
});
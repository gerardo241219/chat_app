const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const axios = require("axios");
const routes = require('./routes/routes.js');

app.use(routes);

io.on("connection", socket => {
    socket.on('chat message', (usuario_id) => {
        getApi(socket, usuario_id);
    });
});

const getApi = async (socket, usuario_id) => {
    const res = await axios.get("https://chatwa.gpoptima.info/api-nuevosLeads?usuario=" + usuario_id);
    socket.emit("respuesta nuevosLeads", res.data.data);
}

server.listen(3000, () => console.log("Server running on"));

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

    socket.on('chat listMessages', (lead_id) => {
        getMessages(socket, lead_id);
    });

    socket.on('chat sendMessage', (idUsuario, idSucursal, lead, mensaje, tipo) => {
        sendMessage(idUsuario, idSucursal, lead, mensaje, tipo);
    });

    socket.on('chat listPlantillas', () => {
        getPlantillas(socket);
    });

    socket.on('chat sendPlantilla', (idUsuario, idSucursal, idLead, idPlantillla, tipoMensaje) => {
        sendPlantilla(idUsuario, idSucursal, idLead, idPlantillla, tipoMensaje);
    });

    socket.on('chat sendEmail', (idUsuario, idSucursal, idLead, idPlantillla, tipoMensaje) => {
        sendEmail(idUsuario, idSucursal, idLead, idPlantillla, tipoMensaje);
    });

    socket.on('chat sendCierre', (idUsuario, idLead, motivo) => {
        sendCierre(socket, idUsuario, idLead, motivo);
    });
});

const getApi = async (socket, usuario_id) => {
    const res = await axios.get("https://chatwa.gpoptima.info/api-nuevosLeads?usuario=" + usuario_id);
    socket.emit("respuesta nuevosLeads", res.data.data);
}

const getMessages = async (socket, lead_id) => {
    const res = await axios.get("https://chatwa.gpoptima.info/api-listMessages?lead=" + lead_id);
    socket.emit("respuesta listMessages", res.data.data);
}

const getPlantillas = async (socket) => {
    const res = await axios.get("https://chatwa.gpoptima.info/api-listPlantillas");
    socket.emit("respuesta listPlantillas", res.data.data);
}

const sendMessage = async (idUsuario, idSucursal, lead, mensaje, tipo) => {
    const res = await axios.get("https://chatwa.gpoptima.info/api-sendMessage?usuario=" + idUsuario + "&sucursal=" + idSucursal + "&lead=" + lead + "&mensaje=" + mensaje + "&tipo=" + tipo);
}

const sendPlantilla = async (idUsuario, idSucursal, idLead, idPlantillla, tipoMensaje) => {
    const res = await axios.get(`https://chatwa.gpoptima.info/api-sendPlantilla?usuario=${idUsuario}&sucursal=${idSucursal}&lead=${idLead}&plantilla=${idPlantillla}&tipo=${tipoMensaje}`);
}

const sendEmail = async (idUsuario, idSucursal, idLead, idPlantillla, tipoMensaje) => {
    const res = await axios.get(`https://chatwa.gpoptima.info/api-sendEmail?usuario=${idUsuario}&sucursal=${idSucursal}&lead=${idLead}&plantilla=${idPlantillla}&tipo=${tipoMensaje}`);
}

const sendCierre = async (socket, idUsuario, idLead, motivo) => {
    const res = await axios.get(`https://chatwa.gpoptima.info/api-sendCierre?usuario=${idUsuario}&lead=${idLead}&motivo=${motivo}`);
    socket.emit("respuesta sendCierre", res.data.message);
}

server.listen(3000, () => console.log("Server running on"));

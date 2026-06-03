const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// El servidor escuchará en el puerto que le asigne internet o en el 3000 local
const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('Dispositivo conectado ID:', socket.id);

    // Reenvía el movimiento al otro dispositivo inmediatamente
    socket.on('movimiento_remoto', (datos) => {
        socket.broadcast.emit('recibir_movimiento', datos);
    });

    socket.on('disconnect', () => {
        console.log('Dispositivo desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});

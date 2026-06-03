const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.send('Servidor de Ajedrez Activo y Funcionando');
});

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('Dispositivo conectado ID:', socket.id);

    // Cuando un jugador entra, lo metemos en su sala privada asignada
    socket.on('unirse_sala', (sala) => {
        socket.join(sala);
        console.log(`Usuario asignado a la sala: ${sala}`);
    });

    // Escucha el movimiento de la sala y lo reenvía exclusivamente a los miembros de esa misma sala
    socket.on('movimiento_remoto', (datos) => {
        socket.to(datos.sala).emit('recibir_movimiento', datos);
    });

    socket.on('disconnect', () => {
        console.log('Dispositivo desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});




const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configuración estricta de seguridad para permitir conexiones externas
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Ruta obligatoria para comprobar que el servidor responde
app.get('/', (req, res) => {
    res.send('Servidor de Ajedrez Activo y Funcionando');
});

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('Dispositivo conectado ID:', socket.id);

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

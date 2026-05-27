const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

let players = {};

io.on('connection', (socket) => {
    console.log('Novo jogador conectado:', socket.id);

    // Cria um novo jogador com cor e posição aleatória
    players[socket.id] = {
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        id: socket.id
    };

    // Envia a lista de jogadores atuais para o novo jogador
    socket.emit('currentPlayers', players);
    
    // Avisa aos outros que um novo jogador entrou
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // Atualiza movimento
    socket.on('playerMovement', (movementData) => {
        if (players[socket.id]) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    // Trata os tiros
    socket.on('shoot', (shootData) => {
        socket.broadcast.emit('enemyShot', shootData);
    });

    // Remove jogador ao desconectar
    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});

import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import chokidar from 'chokidar';

import apiRouter from './routes/index.js';
import { PORT } from "./config/serverConfig.js";
import { handleEditorSocketEvents } from './socketHandlers/editorHandler.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use('/api', apiRouter);

app.get('/ping', (req, res) => {
    return res.json({ message: 'pong' });
});

const editorNamespace = io.of('/editor');
editorNamespace.on('connection', (socket) => {
    const projectId = socket.handshake.query.projectId;
    if (projectId) {
        var watcher = chokidar.watch(`./projects/${projectId}`, {
            ignored: (path) => path.includes('node_modules') || path.includes('.git'),
            persistent: true,
            awaitWriteFinish: {
                stabilityThreshold: 2000,
            },
            ignoreInitial: true,
        })
        watcher.on('all', (event, path) => {
            console.log(event, path);
        });
    }
    handleEditorSocketEvents(socket, editorNamespace);
})

const terminalNamespace = io.of('/terminal');
terminalNamespace.on('connection', (socket) => {
    console.log('terminal connected');

    const projectId = socket.handshake.query.projectId;

    socket.on('shell-input', (data) => {
        console.log('input received', data);
        terminalNamespace.emit('shell-output', data);
    })

    socket.on('disconnect', () => {
        console.log('terminal disconnected');
    })


})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
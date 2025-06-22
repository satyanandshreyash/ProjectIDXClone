import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import chokidar from 'chokidar';

import apiRouter from './routes/index.js';
import { PORT } from "./config/serverConfig.js";
import { handleEditorSocketEvents } from './socketHandlers/editorHandler.js';
import { handleContainerCreate } from './containers/handleContainerCreate.js';
import { WebSocketServer } from 'ws';
import { handleTerminalCreation } from './containers/handleTerminalCreation.js';

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
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

const webSocketForTerminal = new WebSocketServer({
    noServer: true,
})

server.on("upgrade", (req, tcpsocket, head) => {
    const isTerminal = req.url.includes("/terminal");
    if (isTerminal) {
        console.log("req url recieved", req.url);
        const projectId = req.url.split("=")[1];
        console.log("projectId recieved", projectId);
        handleContainerCreate(projectId, webSocketForTerminal, req, tcpsocket, head);
    }
});

webSocketForTerminal.on("connection", (ws, req, container) => {
    console.log("Terminal connected");
    handleTerminalCreation(container, ws);
    ws.on("close", () => {
        container.remove({ force: true }, (err, data) => {
            if (err) {
                console.log("Error removing container", err);
            }
            console.log("Container removed", data);
        })
    })
})
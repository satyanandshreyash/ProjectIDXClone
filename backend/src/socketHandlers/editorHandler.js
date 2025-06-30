import fs from 'fs/promises';
import { get } from 'http';
import pathModule from 'path';
import { getContainerPort } from '../containers/handleContainerCreate.js';

export const handleEditorSocketEvents = (socket, editorNamespace) => {
    socket.on('writeFile', async ({ data, path }) => {
        try {
            const response = await fs.writeFile(path, data);
            editorNamespace.emit('writeFileSuccess', {
                data: "File written successfully",
                path: path
            })
        } catch (error) {
            console.log("Error writing file:", error);
            socket.emit("writeFileError", {
                error: "Error writing file",
            });
        }
    });

    socket.on('createFile', async ({ path }) => {
        try {
            // 1. Try checking if file exists
            await fs.stat(path);

            // If it didn't throw, file exists
            socket.emit("createFileError", {
                error: "File already exists",
            });
            return;
        } catch (err) {
            if (err.code !== "ENOENT") {
                // Unexpected error (e.g. permission denied)
                console.log("Stat error:", err);
                socket.emit("createFileError", {
                    error: "Unexpected error while checking file",
                });
                return;
            }
            // ENOENT means file does not exist — good to proceed
        }
        try {
            // 2. Ensure parent directory exists
            const dirPath = pathModule.dirname(path);
            await fs.mkdir(dirPath, { recursive: true });

            // 3. Create empty file
            await fs.writeFile(path, "");

            socket.emit("createFileSuccess", {
                data: "File created successfully",
            });
        } catch (error) {
            console.log("Error creating file:", error);
            socket.emit("createFileError", {
                error: "Error creating file",
            });
        }
    });

    socket.on('readFile', async ({ path }) => {
        try {
            const response = await fs.readFile(path);
            // console.log("File read from emit on frontend: ", response.toString());
            socket.emit('readFileSuccess', {
                data: response.toString(),
                path: path
            });
        } catch (error) {
            console.log("Error reading file:", error);
            socket.emit("readFileError", {
                error: "Error reading file",
            });
        }
    });

    socket.on('deleteFile', async ({ path }) => {
        try {
            await fs.unlink(path);
            socket.emit('deleteFileSuccess', {
                data: "File deleted successfully",
            });
        } catch (error) {
            console.log("Error deleting file:", error);
            socket.emit("deleteFileError", {
                error: "Error deleting file",
            });
        }
    });

    socket.on('createFolder', async ({ path }) => {
        try {
            const response = await fs.mkdir(path);
            socket.emit('createFolderSuccess', {
                data: "Folder created successfully",
            });
        } catch (error) {
            console.log("Error creating folder:", error);
            socket.emit("createFolderError", {
                error: "Error creating folder",
            });
        }
    });

    socket.on('deleteFolder', async ({ path }) => {
        try {
            await fs.rmdir(path, { recursive: true });
            socket.emit('deleteFolderSuccess', {
                data: "Folder deleted successfully",
            });
        } catch (error) {
            console.log("Error deleting folder:", error);
            socket.emit("deleteFolderError", {
                error: "Error deleting folder",
            });
        }
    });

    socket.on('getPort', async ({ containerName }) => {
        const port = await getContainerPort(containerName);
        console.log("Port for container: ", port);
        socket.emit('getPortSuccess', {
            port: port,
        })
    })
}
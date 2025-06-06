import fs from 'fs/promises';

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
        const isFileExists = await fs.stat(path);
        if (isFileExists) {
            socket.emit('createFileError', {
                error: "File already exists",
            });
            return;
        }
        try {
            const response = await fs.writeFile(path, "");
            socket.emit('createFileSuccess', {
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
}
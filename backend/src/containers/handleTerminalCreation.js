export const handleTerminalCreation = (container, ws) => {
    container.exec({
        Cmd: ["/bin/bash"],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        User: "sandbox",
    }, (err, exec) => {
        if (err) {
            console.log("Error creating exec", err);
            return;
        }
        exec.start({ hijack: true }, (err, stream) => {
            if (err) {
                console.log("Error starting exec", err);
                return;
            }
            stream.write('export PS1="\\[\\033[1;36m\\]\\w\\[\\033[0m\\]$ "\nclear\n');

            // stream processing
            processStreamOutput(stream, ws);
            // stream writing
            ws.on("message", (data) => {
                stream.write(data);
            })

        })
    })
}

function processStreamOutput(stream, ws) {
    let nextDataType = null; // Stores the type of next message
    let nextDataLength = null; // stores the length of next message
    let buffer = Buffer.from("");

    // this is a helper function to process incoming data chunks
    function processStreamData(data) {
        if (data) {
            buffer = Buffer.concat([buffer, data]);
        }
        // if the next data type is not yet known, then we need to read the next 8 bytes to determine the type and length of the next message
        if (!nextDataType) {
            if (buffer.length >= 8) {
                const header = bufferSlicer(8);
                nextDataType = header.readUInt32BE(0);
                nextDataLength = header.readUInt32BE(4);

                processStreamData();
            }
        } else {
            if (buffer.length >= nextDataLength) {
                const content = bufferSlicer(nextDataLength);
                ws.send(content);
                nextDataType = null;
                nextDataLength = null;
                processStreamData();
            }
        }
    }

    function bufferSlicer(end) {
        // this function slices the buffer and returns the sliced buffer and the remaining buffer
        const output = buffer.slice(0, end); // header of buffer
        buffer = Buffer.from(buffer.slice(end, buffer.length)); // remaining buffer
        return output;
    }

    stream.on("data", processStreamData)
}
import Docker from 'dockerode';

const docker = new Docker();

export const handleContainerCreate = async (projectId, socket) => {
    console.log("ProjectId recieved for container create", projectId);

    try {
        const container = await docker.createContainer({
            Image: `sandbox`,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            CMD: ["/bin/bash"],
            Tty: true,
            User: "sandbox",
            HostConfig: {
                Binds: [ // copy folder from host to container
                    `${process.cwd()}/projects/${projectId}:/home/sandbox/app`
                ],
                PortBindings: {
                    "5173/tcp": [
                        {
                            HostPort: "0"
                        }
                    ]
                },
                ExposedPorts: {
                    "5173/tcp": {}
                },
                Env: [
                    "HOST=0.0.0.0"
                ]
            }
        });

        console.log("Container created", container.id);

        await container.start();
        console.log("Container started");

        container.exec({
            Cmd: ["/bin/bash"],
            User: "sandbox",
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,

        }, (err, exec) => {
            if (err) {
                console.log("Error creating exec instance", err);
                return;
            }
            exec.start({ hijack: true }, (err, stream) => {
                if (err) {
                    console.log("Error starting exec instance", err);
                    return;
                }
                processStream(stream, socket);
                socket.on('shell-input', (data) => {
                    stream.write(data);
                })
            });
        })

    } catch (error) {
        console.log("Error creating container", error);
    }
}

function processStream(stream, socket) {
    let buffer = Buffer.from("");
    stream.on("data", (data) => {
        buffer = Buffer.concat([buffer, data]);
        console.log(buffer.toString());
        socket.emit('shell-output', buffer.toString());
        buffer = Buffer.from(""); // Reset buffer after sending
    })

    stream.on("end", () => {
        console.log("Stream ended");
        socket.emit('shell-output', 'Stream ended');
    });

    stream.on("error", (err) => {
        console.log("Stream error", err);
        socket.emit('shell-output', `Stream error: ${err.message}`);
    })
}
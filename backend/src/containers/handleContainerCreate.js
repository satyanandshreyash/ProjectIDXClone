import Docker from 'dockerode';

const docker = new Docker();

export const handleContainerCreate = async (projectId, terminalSocket, req, tcpsocket, head) => {
    console.log("ProjectId recieved for container create", projectId);

    terminalSocket.handleUpgrade(req, tcpsocket, head, async (establishedWSConn) => {
        console.log("Websocket connection upgraded")
        try {
            const container = await docker.createContainer({
                Image: `sandbox`,
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                CMD: ["/bin/bash"],
                Tty: true,
                User: "sandbox",
                ExposedPorts: {
                    "5173/tcp": {}
                },
                Env: [
                    "HOST=0.0.0.0"
                ],
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
                }
            });

            console.log("Container created", container.id);

            await container.start();
            console.log("Container started");
            terminalSocket.emit("connection", establishedWSConn, req, container);
        } catch (error) {
            console.log("Error creating container", error);
            establishedWSConn.close(1011, "Container creation failed");
        }
    })
}
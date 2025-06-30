import Docker from 'dockerode';

const docker = new Docker();

export const handleContainerCreate = async (projectId, terminalSocket, req, tcpsocket, head) => {
    console.log("ProjectId recieved for container create", projectId);

    terminalSocket.handleUpgrade(req, tcpsocket, head, async (establishedWSConn) => {
        console.log("Websocket connection upgraded")
        try {
            const existingContainer = await docker.listContainers({
                name: projectId,
            })
            if (existingContainer.length > 0) {
                const container = docker.getContainer(existingContainer[0].Id);
                await container.remove({ force: true });
            }
            const container = await docker.createContainer({
                Image: `sandbox`,
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                name: projectId,
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

export const getContainerPort = async (containerName) => {
    const container = await docker.listContainers({
        name: containerName,
    })

    if (container.length > 0) {
        const containerInfo = await docker.getContainer(container[0].Id).inspect();
        return containerInfo.NetworkSettings.Ports["5173/tcp"][0].HostPort;
    }
}
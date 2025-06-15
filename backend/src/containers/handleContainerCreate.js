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
                    `../../projects/${projectId}:/home/sandbox/app`
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

    } catch (error) {
        console.log("Error creating container", error);
    }
}
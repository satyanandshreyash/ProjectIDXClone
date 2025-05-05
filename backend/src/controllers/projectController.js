import util from 'util';
import child_process from 'child_process';
import uuid4 from 'uuid4';
import fs from 'fs/promises';

const execPromisified = util.promisify(child_process.exec);

export const createProjectController = async (req, res) => {
    const projectId = uuid4();
    console.log('Creating project with ID:', projectId);

    await fs.mkdir(`./projects/${projectId}`);

    const response = await execPromisified(`npm create vite@latest sandbox -- --template react`, {
        cwd: `./projects/${projectId}`
    })

    res.status(200).json({ message: 'Project created', projectId });
} 
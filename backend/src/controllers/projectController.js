import { createProjectService, getProjectTreeService } from "../service/projectService.js";


export const createProjectController = async (req, res) => {

    const projectId = await createProjectService();
    if (!projectId) {
        return res.status(500).json({ message: 'Failed to create project' });
    }

    res.status(200).json({ message: 'Project created', projectId });
}

export const getProjectTreeController = async (req, res) => {
    const tree = await getProjectTreeService(req.params.projectId);
    if (!tree) {
        return res.status(500).json({ message: 'Failed to get project tree' });
    }
    res.status(200).json({
        data: tree,
        success: true,
        message: 'Project tree fetched successfully'
    })
}

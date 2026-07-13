import { asyncHandler } from "../../utils/asyncHandler.js";
import projectService from "./project.service.js";

const createProject = asyncHandler(async (req, res) => {
    const { organizationId } = req.params;

    const { name, description } = req.body;

    const project = await projectService.createProject({
        organizationId,
        name,
        description,
        userId: req.user.id,
    });

    return res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: project,
    });
});

const projectController = {
    createProject,
};

export default projectController;
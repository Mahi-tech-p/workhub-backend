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

const getProjects = asyncHandler(async (req, res) => {
     const { organizationId } = req.params;

    const projects = await projectService.getProjects({
        organizationId,
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "Projects fetched successfully",
        data: projects,
    });

})
const getProjectById = asyncHandler(async (req, res) => {

    const { projectId } = req.params;

    const project = await projectService.getProjectsByID({
        projectId,
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "Project fetched successfully",
        data: project,
    });

});
const projectController = {
    createProject,
    getProjects,
    getProjectById
};

export default projectController;
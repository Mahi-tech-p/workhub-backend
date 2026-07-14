import { Router } from "express"
import authenticate from "../../middleware/authenticate.middleware.js"
import validate from "../../middleware/validate.middleware.js"
import { createOrganizationSchema } from "./organization.validation.js"
import organizationController from "./organization.controller.js"
import projectController from "../project/project.controller.js"
import { createProjectSchema, organizationParamsSchema } from "../project/project.validation.js"

const router = Router()

router.post('/', authenticate, validate({ body: createOrganizationSchema }), organizationController.createOrganization)
router.get('/', authenticate, organizationController.getOrganizations)

router.post("/:organizationId/projects",authenticate,validate({params: organizationParamsSchema,body: createProjectSchema,}),
    projectController.createProject
);
router.get("/:organizationId/projects",authenticate,validate({params: organizationParamsSchema,}),
    projectController.getProjects
)
export default router
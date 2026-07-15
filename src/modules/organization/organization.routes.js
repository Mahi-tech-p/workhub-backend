import { Router } from "express"
import authenticate from "../../middleware/authenticate.middleware.js"
import validate from "../../middleware/validate.middleware.js"
import { addOrganizationMemberSchema, createOrganizationSchema, organizationMemberParamsSchema } from "./organization.validation.js"
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
router.post(
    "/:organizationId/members",
    authenticate,
    validate({
        params: organizationParamsSchema,
        body: addOrganizationMemberSchema,
    }),
    organizationController.addOrganizationMember
);
router.get(
    "/:organizationId/members",
    authenticate,
    validate({
        params: organizationParamsSchema,
    }),
    organizationController.getOrganizationMembers
);
router.delete(
    "/:organizationId/members/:memberId",
    authenticate,
    validate({
        params: organizationMemberParamsSchema,
    }),
    organizationController.removeOrganizationMember
);
export default router
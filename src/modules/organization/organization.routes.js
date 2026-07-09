import { Router } from "express"
import authenticate from "../../middleware/authenticate.middleware.js"
import validate from "../../middleware/validate.middleware.js"
import { createOrganizationSchema } from "./organization.validation.js"
import organizationController from "./organization.controller.js"

const router = Router()

router.post('/', authenticate, validate({ body: createOrganizationSchema }), organizationController.createOrganization)

export default router
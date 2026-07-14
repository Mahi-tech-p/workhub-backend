import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes.js';
import organizationRoutes from '../modules/organization/organization.routes.js'
import projectRoutes from "../modules/project/project.routes.js";

const router = Router();


router.use("/auth", authRoutes)

router.use("/organizations", organizationRoutes)
router.use("/projects",projectRoutes)

export default router;
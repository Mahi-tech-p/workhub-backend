import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes.js';
import organizationRoutes from '../modules/organization/organization.routes.js'
import projectRoutes from "../modules/project/project.routes.js";
import listRoutes from "../modules/list/list.routes.js";
import taskRoutes from "../modules/task/task.routes.js"
const router = Router();


router.use("/auth", authRoutes)

router.use("/organizations", organizationRoutes)
router.use("/projects", projectRoutes);
router.use("/", listRoutes);
router.use("/", taskRoutes);
export default router;
import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes.js';
import organizationRoutes from '../modules/organization/organization.routes.js'
const router = Router();


router.use("/auth", authRoutes)

router.use("/organizations", organizationRoutes)

export default router;
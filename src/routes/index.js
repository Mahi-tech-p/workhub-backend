import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes.js';
import organizationRoutes from '../modules/organization/organization.routes.js'
import projectRoutes from "../modules/project/project.routes.js";
import listRoutes from "../modules/list/list.routes.js";
import taskRoutes from "../modules/task/task.routes.js"
import commentRoutes from "../modules/comments/comment.routes.js"
import activityRoutes from "../modules/activity/activity.routes.js";
import notificationRoutes from "../modules/notifications/notification.routes.js"
import attachmentRoutes from "../modules/attachments/attachment.routes.js"

const router = Router();

router.use("/auth", authRoutes)

router.use("/organizations", organizationRoutes)
router.use("/projects", projectRoutes);
router.use("/", listRoutes);
router.use("/", taskRoutes);
router.use("/", commentRoutes);
router.use("/", activityRoutes);
router.use("/", notificationRoutes);
router.use("/", attachmentRoutes);

export default router;
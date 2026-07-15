import { Router } from "express";

import authenticate from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import notificationController from "./notification.controller.js";
import { notificationParamsSchema } from "./notification.validation.js";

const router = Router();

router.get(
    "/notifications",
    authenticate,
    notificationController.getNotifications
);

router.patch(
    "/notifications/:notificationId/read",
    authenticate,
    validate({
        params: notificationParamsSchema,
    }),
    notificationController.markAsRead
);

router.patch(
    "/notifications/read-all",
    authenticate,
    notificationController.markAllAsRead
);

export default router;
import { Router } from "express";

import attachmentController from "./attachment.controller.js";

import authenticate from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";

import {
    taskAttachmentParamsSchema,
    attachmentParamsSchema,
} from "./attachment.validation.js";

const router = Router();

router.post(
    "/tasks/:taskId/attachments",
    authenticate,
    validate({
        params: taskAttachmentParamsSchema,
    }),
    upload.single("file"),
    attachmentController.uploadAttachment
);

router.get(
    "/tasks/:taskId/attachments",
    authenticate,
    validate({
        params: taskAttachmentParamsSchema,
    }),
    attachmentController.getTaskAttachments
);

router.delete(
    "/attachments/:attachmentId",
    authenticate,
    validate({
        params: attachmentParamsSchema,
    }),
    attachmentController.deleteAttachment
);
export default router;
import { Router } from "express";

import authenticate from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import listController from "./list.controller.js";
import {
    createListSchema,
    projectParamsSchema,
} from "./list.validation.js";

const router = Router();

router.post(
    "/:projectId/lists",
    authenticate,
    validate({
        params: projectParamsSchema,
        body: createListSchema,
    }),
    listController.createList
);

export default router;
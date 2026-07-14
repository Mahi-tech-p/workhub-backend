import { Router } from "express";

import authenticate from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import listController from "./list.controller.js";
import {
    createListSchema,
    listParamsSchema,
    projectParamsSchema,
    updateListSchema,
} from "./list.validation.js";

const router = Router();
// console.log("LIST ROUTES LOADED");
// console.log("Registering POST /:projectId/lists");
router.post(
    "/projects/:projectId/lists",
    authenticate,
    validate({
        params: projectParamsSchema,
        body: createListSchema,
    }),
    listController.createList
);
router.get(
    "/projects/:projectId/lists",
    authenticate,
    validate({
        params: projectParamsSchema,
    }),
    listController.getLists
);
router.get(
    "/lists/:listId",
    authenticate,
    validate({
        params: listParamsSchema,
    }),
    listController.getListById
);
router.patch(
    "/lists/:listId",
    authenticate,
    validate({
        params: listParamsSchema,
        body: updateListSchema,
    }),
    listController.updateList
);
router.delete(
    "/lists/:listId",
    authenticate,
    validate({
        params: listParamsSchema,
    }),
    listController.deleteList
);

export default router;
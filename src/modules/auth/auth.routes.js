import { Router } from 'express';
import authController from './auth.controller.js';
import validate from '../../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from './auth.validation.js';
import authenticate from '../../middleware/authenticate.middleware.js';

const router = Router();
router.post("/register", validate({body: registerSchema}) ,authController.register);
router.post("/login", validate({ body: loginSchema }), authController.login)
router.post("/refresh-token", authController.refreshAccessToken)
router.get("/me", authenticate, authController.me);
router.post("/logout", authController.logout);
router.post("/logout-all", authenticate, authController.logoutAll);
export default router;
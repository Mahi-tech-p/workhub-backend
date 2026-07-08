import { Router } from 'express';
import authController from './auth.controller.js';
import validate from '../../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from './auth.validation.js';

const router = Router();
router.post("/register", validate({body: registerSchema}) ,authController.register);
router.post("/login",validate({body : loginSchema}), authController.login)
export default router;
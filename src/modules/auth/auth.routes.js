import { Router } from 'express';
import authController from './auth.controller.js';
import validate from '../../middleware/validate.middleware.js';
import { registerSchema } from './auth.validation.js';

const router = Router();
router.post("/register", validate({body: registerSchema}) ,authController.register);

export default router;
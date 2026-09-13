import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { 
  loginController, 
  logoutController, 
  meController, 
  registerController 
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/me', authMiddleware, meController);

export default router;

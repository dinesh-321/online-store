import express from 'express';
import { isAuth, register, login, logout } from '../controllers/adminController.js';
import authAdmin from '../middlewares/authAdmin.js';

const adminRouter = express.Router();

adminRouter.post('/register', register);
adminRouter.post('/login', login);
adminRouter.get('/is-auth', authAdmin, isAuth);
adminRouter.get('/logout', authAdmin, logout);

export default adminRouter;

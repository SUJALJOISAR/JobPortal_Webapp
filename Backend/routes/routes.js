import { Router } from "express";
import { login, logout, register, updateProfile } from "../controllers/userController.js";
import { authenticateToken, loginValidator, registerValidator, validate } from "../utils/validators.js";
import upload from '../utils/multer.js'

const appRouter=Router();

appRouter.post('/register',upload.single('file'),validate(registerValidator),register);
appRouter.post('/login',validate(loginValidator),login);
appRouter.get('/logout',logout);
appRouter.put('/updateProfile',upload.single('file'),authenticateToken,updateProfile);



export default appRouter;
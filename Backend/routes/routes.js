import { Router } from "express";
import { login, logout, register, updateProfile,getUserProfile } from "../controllers/userController.js";
import { authenticateToken, loginValidator, registerValidator, validate } from "../utils/validators.js";
import upload from '../utils/multer.js'

const appRouter=Router();

appRouter.post('/register',upload.single('file'),validate(registerValidator),register);
appRouter.post('/login',validate(loginValidator),login);
appRouter.get('/logout',logout);
appRouter.put('/updateProfile',upload.single('file'),authenticateToken,updateProfile);
// Get user profile using JWT token (user must be logged in)
appRouter.get("/profile", authenticateToken, getUserProfile);



export default appRouter;
import { Router } from "express";
import { login, logout, register, updateProfile } from "../controllers/userController.js";
import { authenticateToken, loginValidator, registerValidator, validate } from "../utils/validators.js";

const appRouter=Router();

appRouter.post('/register',validate(registerValidator),register);
appRouter.post('/login',validate(loginValidator),login);
appRouter.get('/logout',logout);
appRouter.put('/updateProfile',authenticateToken,updateProfile);



export default appRouter;
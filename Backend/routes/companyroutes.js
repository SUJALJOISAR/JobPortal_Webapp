import { Router } from "express";
import { getCompany, getCompanyById, registerCompany,updatecompany } from "../controllers/companycontroller.js";
import { authenticateToken } from "../utils/validators.js";
import upload from '../utils/multer.js'

const companyrouter=Router();

companyrouter.post('/register',authenticateToken,registerCompany);
companyrouter.get('/getcompany',authenticateToken,getCompany);
companyrouter.get('/getcompanybyid/:id',authenticateToken,getCompanyById);
companyrouter.put('/updatecompany/:id',upload.single('file'),authenticateToken,updatecompany);
//this all routes will only be executed if the user is logged in


export default companyrouter;

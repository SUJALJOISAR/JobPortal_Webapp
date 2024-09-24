import { Router } from "express";
import { getCompany, getCompanyById, registerCompany,updatecompany } from "../controllers/companycontroller.js";
import { authenticateToken } from "../utils/validators.js";

const companyrouter=Router();

companyrouter.post('/register',authenticateToken,registerCompany);
companyrouter.get('/getcompany',authenticateToken,getCompany);
companyrouter.get('/getcompanybyid/:id',authenticateToken,getCompanyById);
companyrouter.put('/updatecompany/:id',authenticateToken,updatecompany);
//this all routes will only be executed if the user is logged in


export default companyrouter;

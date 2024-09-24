import { Router } from "express";
import { applyjob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/applicationcontroller.js";
import { authenticateToken } from "../utils/validators.js";

const applicationrouter=Router();

applicationrouter.post('/applyjob',authenticateToken,applyjob);
applicationrouter.get('/appliedjobs',authenticateToken,getAppliedJobs);
applicationrouter.get('/applicants/:id',authenticateToken,getApplicants);
applicationrouter.put('/updateapplication/:id',authenticateToken,updateStatus);


export default applicationrouter;
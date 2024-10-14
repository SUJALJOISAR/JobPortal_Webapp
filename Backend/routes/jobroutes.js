import { Router } from "express";
import { authenticateToken } from "../utils/validators.js";
import { getAdminJobs, getAllJobs, getJobById, hasUserApplied, postJob,updateJobById } from "../controllers/jobcontroller.js";

const jobrouter=Router();

jobrouter.post('/postjob',authenticateToken,postJob);
jobrouter.get('/getalljobs',authenticateToken,getAllJobs);
jobrouter.get('/getjob/:id',authenticateToken,getJobById);
jobrouter.get('/getadminjobs',authenticateToken,getAdminJobs);
jobrouter.get('/hasUserApplied/:id',authenticateToken,hasUserApplied);
jobrouter.put('/updatejob/:id',authenticateToken,updateJobById);
export default jobrouter;
import { Router } from "express";
import { authenticateToken } from "../utils/validators.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/jobcontroller.js";

const jobrouter=Router();

jobrouter.post('/postjob',authenticateToken,postJob);
jobrouter.get('/getalljobs',authenticateToken,getAllJobs);
jobrouter.get('/getjob/:id',authenticateToken,getJobById);
jobrouter.get('/getadminjobs',authenticateToken,getAdminJobs);
export default jobrouter;
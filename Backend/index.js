import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import { connectDatabase } from './db/connection.js';
config();
import appRouter from './routes/routes.js'
import companyrouter from './routes/companyroutes.js';
import jobrouter from './routes/jobroutes.js';
import applicationrouter from './routes/applicationroutes.js';

const app=express();

app.use(cors({
    origin: "http://127.0.0.1:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true,
  }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));

//connect to database
connectDatabase();

//for routes
app.use('/api/user',appRouter);
app.use('/api/company',companyrouter);
app.use('/api/job',jobrouter);
app.use('/api/application',applicationrouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log("Server is running on port 5000");
})


export default app;

//just see the companycontroller where register is done by both student and recruiter so change it as per role
//also see updateCompany where only recruiter can change the company details <--check it
import { createContext, useState, useContext,useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import PropTypes from 'prop-types';

//create the Job Context
const JobContext = createContext();

// create the JobProvider Component to wrap around components that need job data
export const JobProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);//Hold the Fetched Jobs
    const [loading, setLoading] = useState(false);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res=await axios.get('/job/getalljobs');
            if(res.data.success){
                setJobs(res.data.jobs);//Store the jobs in the context
                toast.success("Jobs Loaded Successfully");
            }
            else{
                toast.error("Jobs Not Found");
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Error fetching jobs.");
        }
        finally{
            setLoading(false);
        }
    }

//     // Optionally, fetch jobs when the component mounts
   useEffect(()=>{
    fetchJobs();
   },[])
    // Fetch jobs when the context is first used (like componentDidMount)

    // Fetch job by ID
    const fetchJobById = async (id) => {
        try {
            const res = await axios.get(`/job/getjob/${id}`);
            if (res.data.success) {
                return res.data.job; // Return the single job data
            } else {
                toast.error("Job Not Found");
                return null;
            }
        } catch (error) {
            console.error("Error fetching job:", error);
            toast.error("Error fetching job.");
            return null;
        }
    };

    //fetch applicants for a specific job
    const fetchApplicants= async(id)=>{
        try {
            const res=await axios.get(`application/applicants/${id}`)
            if (res.data.success) {
                return res.data.studentCount;
              } else {
                toast.error("No students have applied for this job.");
                return 0;
              }
        } catch (error) {
            console.error("Error fetching applicants:", error);
            toast.error("Error fetching applicants.");
            return 0;
        }
    }



    return (
        <JobContext.Provider value={{ jobs, fetchJobs, fetchJobById,fetchApplicants,loading }}>
            {children}
        </JobContext.Provider>
    )
}

JobProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useJob = () => {
    return useContext(JobContext);
}
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import PropTypes from 'prop-types';
import { useAuth } from './authContext';

//create the Job Context
const JobContext = createContext();

// create the JobProvider Component to wrap around components that need job data
export const JobProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);//Hold the Fetched Jobs
    const [loading, setLoading] = useState(false);
    const {user,loading:authLoading}=useAuth();

    const postJob = async (jobData) => {
        try {
          setLoading(true);
          const response = await axios.post("/job/postjob", jobData);
          if (response.status === 201) {
            toast.success("Job posted successfully");
            fetchAdminJobs(); //Re-fetch the Admin jobs after posting the job successfully
          } else {
            toast.error("Failed to post job.");
          }
        } catch (error) {
          if (error.response && error.response.data) {
            toast.error(error.response.data.msg || "An error occurred.");
          } else {
            toast.error("Network error. Please try again.");
          }
        } finally {
          setLoading(false);
        }
      };

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/job/getalljobs');
            if (res.data.success) {
                setJobs(res.data.jobs);//Store the jobs in the context
                toast.success("Jobs Loaded Successfully");
            }
            else {
                toast.error("Jobs Not Found");
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Error fetching jobs.");
        }
        finally {
            setLoading(false);
        }
    }

    // Fetch jobs created by the logged-in admin (recruiter)
    const fetchAdminJobs = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/job/getadminjobs'); // Assuming this is the endpoint for admin jobs
            if (res.data.success) {
                console.log("from fetchAdminJobs",res.data)
                setJobs(res.data.jobs); // Store admin-specific jobs in the context
                toast.success("Admin Jobs Loaded Successfully");
            } else {
                toast.error("No Jobs Found for Admin");
            }
        } catch (error) {
            console.error("Error fetching admin jobs:", error);
            toast.error("Error fetching admin jobs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Wait until the auth loading is done
        if (!authLoading) {
            // Fetch jobs depending on the user's role
            if (user?.role === 'recruiter') {
                fetchAdminJobs();
            } else {
                fetchJobs();
            }
        }
    }, [authLoading, user]);
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
    const fetchApplicants = async (id) => {
        try {
            const res = await axios.get(`/application/applicants/${id}`);
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

    // check if the loggedin user has applied for the job or not
    const checkUserApplication = async (id) => {
        try {
            const res = await axios.get(`/job/hasUserApplied/${id}`);
            if (res.data.success) {
                return res.data.hasApplied; // Boolean indicating whether the user applied
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error checking user application:", error);
            toast.error("Error checking application status.");
            return false;
        }
    };

    //apply for job when click on 'Apply Now' Button
    const applyForJob = async (jobId) => {
        try {
            const res=await axios.post('/application/applyjob',{jobId});
            if (res.data.success) {
                toast.success("Job application submitted successfully");
                return true; // Indicating successful application
              } else {
                toast.error(res.data.msg || "Failed to apply for the job");
                return false;
              }
        } catch (error) {
            console.error("Error applying for the job:", error);
            toast.error("Error applying for the job.");
            return false;
        }
    }



    return (
        <JobContext.Provider value={{ jobs,postJob, fetchJobs, fetchJobById, fetchApplicants, checkUserApplication, applyForJob,fetchAdminJobs,loading }}>
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
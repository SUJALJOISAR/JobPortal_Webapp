import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { ArrowLeft } from 'lucide-react';
import { useJob } from '../AuthContext/jobContext'; // Import the job context
import { toast } from 'sonner';
import axios from 'axios';

const AdminJobUpdate = () => {
  const [input, setInput] = useState({
    title: '',
    company_name: '',
    position: '',
    location: '',
    salary: '',
    jobtype: ''
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); // Job ID from URL
  const navigate = useNavigate();
  const { fetchJobById,fetchAdminJobs } = useJob(); // Access fetchJobById, updateJob, and fetchAdminJobs from context

  // Fetch job details on component mount
  useEffect(() => {
    const getJobDetails = async () => {
      try {
        const job = await fetchJobById(id); // Fetch job details using context
        if (job) {
          setInput({
            title: job.title,
            // company_name: job.company_name,
            companyId: job.company, // Set company ID instead of name
            position: job.position,
            location: job.location,
            salary: job.salary,
            jobtype: job.jobtype,
          });
        } else {
          toast.error("Failed to fetch job details.");
        }
      } catch (error) {
        toast.error("Error fetching job details.");
        console.error(error);
      }
    };
    getJobDetails();
  }, [id, fetchJobById]);

  // Handle form input changes
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const updatedJobData = {
          ...input,
        //   company: input.company_name, // Ensure company name is sent in the request
        company: input.companyId, // Ensure companyId is sent in the request
        };
  
        // Direct axios PUT request to update job
        const res = await axios.put(`/job/updatejob/${id}`, updatedJobData);
  
        if (res.data.success) {
          toast.success("Job updated successfully!");
          fetchAdminJobs();
          navigate('/admin/jobs'); // Navigate to admin job listing
        } else {
          toast.error("Failed to update job details.");
        }
      } catch (error) {
        console.error("Error updating job details:", error);
        toast.error("Error updating job details.");
      } finally {
        setLoading(false);
      }
    };

  if (!input.title) return <p>Loading...</p>; // Show loading message while fetching data

  return (
    <div>
      <Navbar />
      <div className='max-w-xl mx-auto my-10'>
        <form onSubmit={submitHandler}>
          <div className='flex items-center gap-5 p-8'>
            <Button onClick={() => navigate("/admin/jobs")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
              <ArrowLeft />
              <span>Back</span>
            </Button>
            <h1 className='font-bold text-xl'>Update Job Details</h1>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label>Job Title</Label>
              <Input type="text" name="title" value={input.title} onChange={changeEventHandler} />
            </div>
            <div>
              <Label>Company Name</Label>
              <Input type="text" name="company_name" value={input.company_name} disabled />
            </div>
            <div>
              <Label>Position</Label>
              <Input type="text" name="position" value={input.position} onChange={changeEventHandler} />
            </div>
            <div>
              <Label>Location</Label>
              <Input type="text" name="location" value={input.location} onChange={changeEventHandler} />
            </div>
            <div>
              <Label>Salary</Label>
              <Input type="text" name="salary" value={input.salary} onChange={changeEventHandler} />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input type="text" name="jobtype" value={input.jobtype} onChange={changeEventHandler} />
            </div>
          </div>
          <Button type="submit" className="w-full my-4" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminJobUpdate;

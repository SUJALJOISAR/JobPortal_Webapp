import { useState, useEffect } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
// import PropTypes from 'prop-types'; // Importing PropTypes
import { useParams } from 'react-router-dom';
import { useJob } from './AuthContext/jobContext'; // Import the JobContext
import Navbar from './shared/Navbar';

const JobDescription = () => {
    const [isApplied, setIsApplied] = useState(false); // State to track if the user has applied
    const { id } = useParams(); // Get job id from the URL
    const { fetchJobById, fetchApplicants, checkUserApplication,applyForJob} = useJob(); // Destructure the fetchJobById from context
    const [jobDetails, setJobDetails] = useState(null); // Store job details
    const [applicantsCount, setApplicantsCount] = useState(0); // Store the total number of applicants

    useEffect(() => {
        const fetchJobDetails = async () => {
            const job = await fetchJobById(id);//Fetch job Details by ID
            if (job) {
                setJobDetails(job);
            }
        };

        const fetchTotalApplicants = async () => {
            const count = await fetchApplicants(id);
            setApplicantsCount(count);
        };

        const checkIfApplied = async () => {
            const hasApplied = await checkUserApplication(id); // Check if the user has applied for this job
            setIsApplied(hasApplied); // Update the state based on the response
        };

        fetchJobDetails();
        fetchTotalApplicants();
        checkIfApplied();
    }, [id, fetchJobById, fetchApplicants, checkUserApplication]);

    // Function to handle the application process
    const handleApply = async () => {
        const success = await applyForJob(id); // Apply for the job
        if (success) {
            setIsApplied(true); // Update the state if the application is successful
        }
    };


    if (!jobDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='font-bold text-xl'>{jobDetails.title}</h1>
                        <div className='flex items-center gap-2 mt-4'>{jobDetails.company_name}</div>
                        <Badge className={'text-blue-700 font-bold'} variant="ghost">{jobDetails.position}</Badge>
                        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{jobDetails.jobtype}</Badge>
                        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{jobDetails.salary} LPA</Badge>
                    </div>
                    <Button onClick={handleApply} disabled={isApplied} className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}>{isApplied ? 'Already Applied' : 'Apply Now'}</Button>
                </div>
                <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
                <div className='my-4'>
                    <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{jobDetails.position}</span></h1>
                    <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{jobDetails.location}</span></h1>
                    <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{jobDetails.description}</span></h1>
                    <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{jobDetails.experiencelevel} yrs</span></h1>
                    <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{jobDetails.salary} LPA</span></h1>
                    <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{applicantsCount}</span></h1>
                    <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{new Date(jobDetails.created_at).toLocaleDateString()}</span></h1>
                </div>
            </div>
        </div>
    )
}

export default JobDescription

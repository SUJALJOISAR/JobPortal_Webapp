// import {useEffect} from 'react'
import LatestJobCards from "./LatestJobCards"
import { useJob } from './AuthContext/jobContext'

const LatestJobs = () => {
  const {jobs,loading}=useJob();

   // Get the current date and time
   const currentDate = new Date();

   // Filter jobs to show only those posted within the last 1 day
   const recentJobs = jobs.filter(job => {
     const jobPostedDate = new Date(job.created_at); // Assuming `createdAt` holds the job posting date
     const timeDifference = currentDate - jobPostedDate; // Difference in milliseconds
     const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 1 day in milliseconds
     return timeDifference <= oneDayInMilliseconds; // Return true if job was posted within the last 24 hours
   });

  if (loading) {
    return <div>Loading jobs...</div>;
  }
  return (
    <div>
       <div className='max-w-7xl mx-auto my-20'>
            <h1 className='text-4xl font-bold'><span className='text-[#6A38C2]'>Latest & Top </span> Job Openings</h1>
            <div className='grid grid-cols-3 gap-4 my-5'>
               {
                recentJobs.length === 0 ? <span>Jobs Not Found</span> : (
                  recentJobs?.slice(0,6).map((job)=><LatestJobCards key={job._id} job={job}/>)
                )
               }
            </div>
    </div>
</div>
  )
}

export default LatestJobs

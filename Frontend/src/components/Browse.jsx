import {useState,useEffect} from 'react'
import Navbar from "./shared/Navbar"
import Job from "./ui/Job";
import axios from 'axios';
import { useLocation } from 'react-router-dom';


const Browse = () => {
  const location=useLocation();
  const keyword=new URLSearchParams(location.search).get('keyword');//get the search keyword
  const [jobs, setJobs] = useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`/job/getalljobs?keyword=${encodeURIComponent(keyword)}`);
        
        // Ensure the data exists before trying to access it
        if (response.data && response.data.success) {
          setJobs(response.data.jobs);
        } else {
          console.log('Error fetching jobs:', response.data.msg);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchJobs();
  }, [keyword]);
   return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto my-10">
                <h1 className="font-bold text-xl my-10">Search Results for "{keyword}" ({jobs.length})</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {jobs.length > 0 ? jobs.map((job) => (
                            <Job key={job.id} job={job} /> // Assuming Job component can accept job details as a prop
                        )) : (
                            <div>No jobs found.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Browse

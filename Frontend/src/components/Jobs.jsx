import Navbar from "./shared/Navbar";
import FilterCard from "./ui/FilterCard";
import Job from "./ui/Job";
import { useJob } from "./AuthContext/jobContext";
import { useAuth } from "./AuthContext/authContext"; // Import the Auth context
import { useState, useEffect } from "react";
import axios from "axios";

const Jobs = () => {
  const { jobs, setJobs } = useJob();
  const { user } = useAuth(); // Get the current user from Auth context
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  // Function to fetch jobs based on filters
  const fetchJobs = async (appliedFilters) => {
    setLoading(true);
    try {
      const response = await axios.get(`/job/getalljobs`, { params: appliedFilters });
      if (response.data.success) {
        setJobs(response.data.jobs);
      } else {
        console.log("No jobs found", response.data.msg);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle filter change event from FilterCard
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters); // Update filters state
  };

  // useEffect to fetch jobs when filters change
  useEffect(() => {
    fetchJobs(filters);
  }, [filters]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        {!user ? (
          <div className="my-20 text-center">
            <h1 className="text-4xl font-bold">
              Please <span className="text-[#6A38C2]">Log In</span> to view the jobs.
            </h1>
          </div>
        ) : (
          <div className="flex gap-5">
            <div className="w-20%">
              <FilterCard onFilterChange={handleFilterChange} />
            </div>
            {jobs.length <= 0 ? (
              <span>Job not Found!</span>
            ) : (
              <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
                <div className="grid grid-cols-3 gap-4">
                  {jobs.map((job) => (
                    <div key={job._id}>
                      <Job job={job} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;

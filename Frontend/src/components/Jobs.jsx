import Navbar from "./shared/Navbar";
import FilterCard from "./ui/FilterCard";
import Job from "./ui/Job";
import { useJob } from "./AuthContext/jobContext";
import { useAuth } from "./AuthContext/authContext"; // Import the Auth context

const Jobs = () => {
  const { jobs } = useJob();
  const { user } = useAuth(); // Get the current user from Auth context

  if (!user) {
    return (
      <div>     
         <Navbar />
        <div className="max-w-7xl mx-auto my-20">
          <h1 className="text-4xl font-bold text-center">
            Please <span className="text-[#6A38C2]">Log In</span> to view the jobs.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="w-20%">
            <FilterCard />
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
      </div>
    </div>
  );
};

export default Jobs;

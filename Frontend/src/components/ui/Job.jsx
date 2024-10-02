// import React from 'react'
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "./button"
import { Bookmark } from 'lucide-react';
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types'; // Importing PropTypes

const Job = ({job}) => {
    const navigate=useNavigate();
     // Function to calculate the time difference
     const timeAgo = (date) => {
        const now = new Date();
        const postedDate = new Date(date);
        const timeDiff = now - postedDate; // Difference in milliseconds
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    };

    return (
        <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{timeAgo(job?.created_at)}</p>
                <Button variant="outline" className="rounded-full" size="icon"><Bookmark /></Button>
            </div>

            <div className="flex items-center gap-2 my-2">
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf4cBXHnRqShLYgK0qNvI57kA-putli1_csg&s"></AvatarImage>
                    </Avatar>
                </Button>
                <div>
                    <h1 className="font-medium text-lg">{job?.company_name}</h1>
                    <p className="text-sm text-gray-500">India</p>
                </div>
            </div>

            <div>
                <h1 className="font-bold text-lg my-2">{job?.title}</h1>
                <p className="text-sm text-gray-600">{job?.description}</p>
            </div>
            <div className='flex items-center gap-1 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position}</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobtype}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <div className="flex items-center gap-4 mt-4">
                <Button onClick={()=>navigate(`/description/${job?.id}`)} variant="outline">Details</Button>
                <Button className="bg-[#7209b7]">Save For Later</Button>
            </div>
        </div>
    )
}

// Adding prop types validation
Job.propTypes = {
    job: PropTypes.shape({
      company_name:PropTypes.string.isRequired,
      id:PropTypes.number,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      location: PropTypes.string,
      companyName: PropTypes.string,
      position: PropTypes.string,
      jobtype: PropTypes.string,
      salary: PropTypes.number,
      created_at: PropTypes.string.isRequired, // Ensure created_at is required
    }).isRequired,
  };

export default Job

// import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJob } from "../AuthContext/jobContext";
import PropTypes from 'prop-types'; // Import PropTypes

const AdminJobsTable = ({filter}) => {
    const { jobs } = useJob(); //Fetch Jobs from JobContext
    const navigate = useNavigate();

     // Function to filter jobs based on the input
     const filteredJobs = jobs.filter((job) => {
        const lowerCaseFilter = filter.toLowerCase();
        return (
            job.title.toLowerCase().includes(lowerCaseFilter) ||
            job.company_name.toLowerCase().includes(lowerCaseFilter) ||
            job.position.toLowerCase().includes(lowerCaseFilter) ||
            job.jobtype.toLowerCase().includes(lowerCaseFilter) ||
            job.location.toLowerCase().includes(lowerCaseFilter)
        );
    });
    return (
        <div>
            {filteredJobs.length > 0 ? (
                <Table>
                    <TableCaption>A List of Your Recent Registered Companies</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Job Title</TableHead>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Salary</TableHead>
                            <TableHead>Job Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredJobs.map((job) => (
                            <TableRow key={job.id}>
                                <TableCell>{job.title}</TableCell>
                                <TableCell>{job.company_name}</TableCell> {/* Company Name */}
                                <TableCell>{job.position}</TableCell> {/* Position */}
                                <TableCell>{job.location}</TableCell> {/* Location */}
                                <TableCell>{job.salary}</TableCell> {/* Salary */}
                                <TableCell>{job.jobtype}</TableCell> {/* Job Type */}
                                <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            <div onClick={() => navigate(`/admin/jobs/${job.id}`)} className="flex items-center gap-2 w-fit cursor-pointer">
                                                <Edit2 className="w-4" />
                                                <span>Edit</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p>No Jobs Posted yet.</p>
            )}
        </div>

    )
}

// Define prop types for the component
AdminJobsTable.propTypes = {
    filter: PropTypes.string.isRequired, // Specify that 'filter' is required and should be a string
};

export default AdminJobsTable

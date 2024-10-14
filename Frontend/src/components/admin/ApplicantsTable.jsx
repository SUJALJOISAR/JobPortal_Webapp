import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = ({ applicants }) => {

  const [loading, setLoading] = useState(false);

  // The statusHandler function that handles the status update
  const statusHandler = async (newStatus, applicantId) => {
    console.log("Applicant ID:",applicantId);
    setLoading(true); //set loading true when the request starts
    try {
      const response = await axios.put(`/application/updateapplication/${applicantId}`,{status:newStatus});
      if (response.data.success) {
        console.log('Status updated successfully:', response.data.msg);
        // Optionally, refresh the applicants or update the UI here
      } else {
        console.error('Failed to update status:', response.data.msg);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);  // Set loading to false after request is done
    }
  };

return (
  <div>
    <Table>
      <TableCaption>A list of applicants for the job</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Resume</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applicants && applicants.map((applicant, index) => {
          console.log("Applicants Object:",applicant);
          return (
          <TableRow key={index}>
            <TableCell>{applicant?.name || 'N/A'}</TableCell>
            <TableCell>{applicant?.email || 'N/A'}</TableCell>
            <TableCell>{applicant?.phone || 'N/A'}</TableCell>
            <TableCell>
              {applicant?.resumeOriginalName ? (
                <a
                  className="text-blue-600 cursor-pointer"
                  href={`http://localhost:5000/uploads/${applicant.resumeOriginalName}`} // URL pointing to your server's uploads folder
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {applicant?.resumeOriginalName || 'Download Resume'}
                </a>
              ) : (
                <span>N/A</span>
              )}
            </TableCell>
            <TableCell>{applicant?.createdAt?.split("T")[0] || 'N/A'}</TableCell>
            <TableCell className="float-right cursor-pointer">
              <Popover>
                <PopoverTrigger>
                  <MoreHorizontal />
                </PopoverTrigger>
                <PopoverContent className="w-32">
                  {shortlistingStatus.map((status, index) => (
                    <div
                    onClick={() => {
                      console.log("Selected applicant ID:", applicant.applicantId);  // Log the correct ID
                      statusHandler(status, applicant.applicantId); // Use applicant.id instead of applicant._id
                    }}
                      key={index}
                      className='flex w-fit items-center my-2 cursor-pointer'
                    >
                      <span>{status}</span>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        )})} 
      </TableBody>
    </Table>
  </div>
);
};

// PropTypes validation
ApplicantsTable.propTypes = {
  applicants: PropTypes.arrayOf(PropTypes.shape({
    applicantId: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    resume: PropTypes.string,
    resumeOriginalName: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
  })).isRequired,
  statusHandler: PropTypes.func.isRequired, // Handler function for status update
};

export default ApplicantsTable;

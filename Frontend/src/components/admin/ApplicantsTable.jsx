import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import PropTypes from 'prop-types';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = ({ applicants, statusHandler }) => {
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
          {applicants && applicants.map((applicant, index) => (
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
                        onClick={() => statusHandler(status, applicant._id)}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// PropTypes validation
ApplicantsTable.propTypes = {
  applicants: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
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

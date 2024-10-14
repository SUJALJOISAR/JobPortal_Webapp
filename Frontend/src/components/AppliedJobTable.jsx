import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import axios from 'axios';
import { toast } from 'sonner'; // Import toast from Sonner

const AppliedJobTable = () => {
  const [allAppliedJobs, setAllAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get('application/appliedjobs');
        if (response.data.success) {
          setAllAppliedJobs(response.data.applications); // Set the applications data
          toast.success('Applied jobs retrieved successfully!'); // Success toast
        } else {
          console.error('Error fetching applied jobs:', response.data.message);
          toast.error(response.data.message || 'Error fetching applied jobs.'); // Error toast
        }
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
        toast.error('An error occurred while fetching applied jobs.'); // Error toast
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAppliedJobs();
  }, []);

  return (
    <div>
      <Table>
        <TableCaption>A list of your applied jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4}>Loading...</TableCell>
            </TableRow>
          ) : allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={4}>You haven&apos;t applied for any jobs yet.</TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob.applicationId}>
                <TableCell>{new Date(appliedJob.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{appliedJob.jobTitle}</TableCell>
                <TableCell>{appliedJob.companyName}</TableCell>
                <TableCell className="text-right">
                  <Badge className={`${appliedJob.status === 'rejected' ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>
                    {appliedJob.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;

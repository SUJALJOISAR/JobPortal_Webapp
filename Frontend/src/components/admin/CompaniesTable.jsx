import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes

const CompaniesTable = ({ companies }) => {
  const navigate = useNavigate();

  return (
    <div>
      {companies.length > 0 ? (
        <Table>
          <TableCaption>A List of Your Recent Registered Companies</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                <Avatar>
                    {/* Check if company.logo exists, if not use default logo */}
                    {company.logo ? (
                      <AvatarImage 
                        src={`http://localhost:5000/uploads/${company.logo}`} // Adjust the URL based on your server configuration
                        alt={`${company.name} Logo`} 
                      />
                    ) : (
                      <AvatarImage 
                        src="https://via.placeholder.com/150" 
                        alt="Default Logo" 
                      />
                    )}
                  </Avatar>
                </TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      <div onClick={() => navigate(`/admin/companies/${company.id}`)} className="flex items-center gap-2 w-fit cursor-pointer">
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
        <p>No companies registered yet.</p>
      )}
    </div>
  );
};

// Add PropTypes validation
CompaniesTable.propTypes = {
    companies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired, // Assuming 'created_at' is a string
        logo: PropTypes.string, // Assuming logo can be a string
      })
    ).isRequired,
  };

export default CompaniesTable;

import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Register a new company
  const registerCompany = async (companyData) => {
    try {
      setLoading(true);
      const response = await axios.post("/company/register", companyData);
      if (response.status === 201) {
        toast.success("Company registered successfully");
        const companyId = response.data.company.id;
        navigate(`/admin/companies/${companyId}`);
      } else {
        toast.error("Failed to register company. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred.");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Get all companies for logged-in user
  const getCompanies = async (filterName = " ") => {
    try {
      setLoading(true);
      // Check if filterName is provided, if not, just omit it from the params
      const trimmedFilter = filterName.trim();
      const response = await axios.get("/company/getcompany", {
        params: trimmedFilter ? { name: trimmedFilter } : {}, // Pass params only if filterName exists
      });
  //pass the filter name in the query params
      if (response.status === 200) {
        setCompanies(response.data.companies);
      } else {
        toast.error("Failed to fetch companies.");
      }
    } catch (error) {
        if (error.response && error.response.data) {
         toast.error(error.response.data.message || "An error occurred.");
        }
    } finally {
      setLoading(false);
    }
  };

  // Get company by ID
  const getCompanyById = async (companyId) => {
    try {
      const response = await axios.get(`/company/getcompanybyid/${companyId}`);
      if (response.status === 200) {
        return response.data.company;
      } else {
        toast.error("Failed to fetch company details.");
      }
    } catch (error) {
        if (error.response && error.response.data) {
            toast.error(error.response.data.message || "An error occurred.");
        }
    }
  };

  //update company details
  const updateCompany = async (companyId, companyData) => {
    try {
      setLoading(true);
      const response = await axios.put(`/company/updatecompany/${companyId}`, companyData);
      if (response.status === 200) {
        toast.success("Company updated successfully");
        navigate(`/admin/companies`); // Redirect after successful update
      } else {
        toast.error("Failed to update company.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred.");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        loading,
        registerCompany,
        getCompanies,
        getCompanyById,
        updateCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => useContext(CompanyContext);
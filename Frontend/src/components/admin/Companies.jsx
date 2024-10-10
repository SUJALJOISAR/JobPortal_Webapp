import {useState,useEffect} from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import Navbar from "../shared/Navbar"
import { useCompanyContext } from '../AuthContext/companyContext'

const Companies = () => {
    const navigate=useNavigate();
    const [input,setInput]=useState();
    const { companies, getCompanies, loading } = useCompanyContext();

    useEffect(() => {
        getCompanies(input); // Fetch companies when the component mounts
      }, [input]);

  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <Input
                        className="w-fit"
                        placeholder="Filter by name"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button onClick={() => navigate("/admin/companies/create")}>New Company</Button>
                </div>
                {loading ? <p>Loading...</p> : <CompaniesTable companies={companies} />}
            </div>
        </div>
  )
}

export default Companies

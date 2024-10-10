import {useState} from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useCompanyContext } from '../AuthContext/companyContext'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const { registerCompany, loading } = useCompanyContext();

    const registerNewCompany =async()=>{
        if (!companyName.trim()) {
            toast.error('Company name cannot be empty'); // Show error if company name is empty
            return;
        }
        registerCompany({ name: companyName });
    }
  return (
    <div>
            <Navbar />
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Your Company Name</h1>
                    <p className='text-gray-500'>What would you like to give your company name? you can change this later.</p>
                </div>

                <Label>Company Name</Label>
                <Input
                    type="text"
                    className="my-2"
                    placeholder="JobHunt, Microsoft etc."
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <div className='flex items-center gap-2 my-10'>
                    <Button variant="outline" onClick={() => navigate("/admin/companies")}>Cancel</Button>
                    <Button onClick={registerNewCompany} disables={loading}>{loading ? "Loading..." : "Continue"}</Button>
                </div>
            </div>
        </div>
  )
}

export default CompanyCreate

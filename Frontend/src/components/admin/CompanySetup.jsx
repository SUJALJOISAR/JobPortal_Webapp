import React ,{useEffect,useState} from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useNavigate, useParams } from 'react-router-dom'
// import { toast } from 'sonner'
import { useCompanyContext } from '../AuthContext/companyContext'


const CompanySetup = () => {
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const [loading, setLoading] = useState(false);
    const { getCompanyById,updateCompany } = useCompanyContext();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchCompany = async () => {
            const company = await getCompanyById(id);
            if (company) {
                setInput({
                    name: company.name,
                    description: company.description,
                    website: company.website,
                    location: company.location,
                    file: null,
                });
            }
        };
        fetchCompany();
    }, [id, getCompanyById]);

    const changeEventHandler = async(e)=>{
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = async (e)=>{
        const file=e.target.files?.[0];
        setInput({ ...input, file});
    }

    const submitHandler = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        await updateCompany(id,formData);
    }

  return (
    <div>
    <Navbar />
    <div className='max-w-xl mx-auto my-10'>
        <form onSubmit={submitHandler}>
            <div className='flex items-center gap-5 p-8'>
                <Button onClick={() => navigate("/admin/companies")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                    <ArrowLeft />
                    <span>Back</span>
                </Button>
                <h1 className='font-bold text-xl'>Company Setup</h1>
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <Label>Company Name</Label>
                    <Input
                        type="text"
                        name="name"
                        value={input.name}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Description</Label>
                    <Input
                        type="text"
                        name="description"
                        value={input.description}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Website</Label>
                    <Input
                        type="text"
                        name="website"
                        value={input.website}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Location</Label>
                    <Input
                        type="text"
                        name="location"
                        value={input.location}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Logo</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={changeFileHandler}
                    />
                </div>
            </div>
            {
                loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
            }
        </form>
    </div>
</div>
  )
}

export default CompanySetup

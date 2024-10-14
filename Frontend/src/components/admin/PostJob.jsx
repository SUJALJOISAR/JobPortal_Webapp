import { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
// import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useJob } from '../AuthContext/jobContext';
import { useCompanyContext } from '../AuthContext/companyContext';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobtype: "",
        experiencelevel: "",
        position: 0,
        companyId: "",
    });

    const { companies, getCompanies } = useCompanyContext();
    const { postJob, loading } = useJob();
    const navigate = useNavigate();

    useEffect(() => {
        getCompanies(); // Fetch companies when the component mounts
    }, []);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    // const selectChangeHandler = (value) => {
    //     const selectedCompany = companies.find((company) => company.name.toLowerCase() === value.toLowerCase());
    //     if (selectedCompany) {
    //         console.log("Selected Company:", selectedCompany); // Log the entire selected company object
    //         setInput({ ...input, companyId: selectedCompany.id });
    //     } else {
    //         console.error("Company not found for value:", value);
    //     }
    // };

    const submitHandler = async (e) => {
        e.preventDefault();
        // Ensure all fields are filled out
        const jobData = {
            title: input.title,
            description: input.description,
            requirements: input.requirements,
            salary: input.salary,
            location: input.location,
            jobtype: input.jobtype,
            experiencelevel: input.experiencelevel,
            position: input.position, // Send position as string
            companyId: input.companyId, // Include companyId from input
        };

        console.log("Job Data Being Posted:", jobData); // Log the job data being sent to the backend

        // Call the postJob function
        await postJob(jobData);
        navigate("/admin/jobs"); // Redirect after posting the job, adjust the path as needed
    };

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobtype"
                                value={input.jobtype}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Experience Level</Label>
                            <Input
                                type="text"
                                name="experiencelevel"
                                value={input.experiencelevel}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>No of Positions</Label>
                            <Input
                                type="number" // Changed to text for string input
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        {
                            companies.length > 0 && (
                                <Select onValueChange={(value) => setInput({ ...input, companyId: value })}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company.id} value={company.id.toString()}>{company.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )

                        }
                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Post New Job</Button>
                    }
                    {
                        companies.length === 0 && <p className='text-xs text-red-600 font-bold text-center my-3'>*Please register a company first, before posting a job</p>
                    }
                </form>
            </div>
        </div>
    )
}

export default PostJob;

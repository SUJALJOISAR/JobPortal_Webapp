import { useState } from 'react';
import Navbar from "../shared/Navbar";
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Signup from '../../images/Sign up.mp4'; // Assuming you want to keep the same gif or video
import { useAuth } from '../AuthContext/authContext';
import { Loader2 } from 'lucide-react';

const Register = () => {
    const [input, setInput] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
        file: ""
    });

    const {loading,register}=useAuth();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData(); // formdata object
        formData.append("name", input.name);
        formData.append("email", input.email);
        formData.append("phone", input.phone);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }
        const res = await register(formData);
        if (res.success) {
            toast.success(res.msg);
            navigate('/login');
        } else {
            toast.error(res.msg); // Show error message
        }
    };

    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center max-w-7xl mx-auto my-10">
                <div className="flex flex-col md:flex-row w-full border border-gray-200 rounded-md bg-gray-800 text-white">
                    
                    {/* Left side form */}
                    <form onSubmit={submitHandler} className="w-full md:w-1/2 p-8 bg-white text-black">
                        <h1 className="font-bold text-xl mb-5">Sign Up</h1>
                        <div className="my-2">
                            <Label>Full Name</Label>
                            <Input
                                type="text"
                                value={input.name}
                                name="name"
                                onChange={changeEventHandler}
                                placeholder="Fullname"
                                className="bg-gray-200 text-black"
                            />
                        </div>
                        <div className="my-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                placeholder="name@gmail.com"
                                className="bg-gray-200 text-black"
                            />
                        </div>
                        <div className="my-2">
                            <Label>Phone Number</Label>
                            <Input
                                type="text"
                                value={input.phone}
                                name="phone"
                                onChange={changeEventHandler}
                                placeholder="Contact No."
                                className="bg-gray-200 text-black"
                            />
                        </div>
                        <div className="my-2">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                placeholder="Password"
                                className="bg-gray-200 text-black"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <RadioGroup className="flex items-center gap-4 my-5">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                    />
                                    <Label htmlFor="r1">Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === 'recruiter'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                    />
                                    <Label htmlFor="r2">Recruiter</Label>
                                </div>
                            </RadioGroup>
                            <div className="flex items-center gap-2">
                                <Label>Profile</Label>
                                <Input
                                    accept="image/*"
                                    type="file"
                                    onChange={changeFileHandler}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>
                        {/* <Button type="submit" className="w-full my-4">Signup</Button> */}

                        <Button type="submit" className="w-full my-4 bg-gray-800 text-white">
                            {loading ? "Please wait..." : "Signup"} {/* Loading message */}
                        </Button>
                        {loading && <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button>} {/* Loader */}
                        <span className="text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>
                    </form>

                    {/* Partition */}
                    <div className="hidden md:block w-px bg-gray-400"></div>

                    {/* Right side Storyset video */}
                    <div className="hidden md:block w-full md:w-1/2 p-8 bg-white flex items-center justify-center">
                        <video
                            src={Signup} // Replace with your Storyset GIF video URL
                            autoPlay
                            loop
                            muted
                            className="w-full h-96 object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

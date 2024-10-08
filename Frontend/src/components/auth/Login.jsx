import { useState,useEffect } from 'react';
import Navbar from "../shared/Navbar";
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import TabletLogin from '../../images/Tablet login.mp4';
// import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../AuthContext/authContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const { loading, login,user } = useAuth();
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });

     // Check if token exists in localStorage on component mount
     useEffect(() => {
        // If user is already logged in (token exists), redirect to home
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        // console.log("Login data:", input); // Log the login data
        const res = await login(input);
        if (res.success) {
            // Save the token in localStorage
            localStorage.setItem('token', res.user.token);
            toast.success(res.msg);
            navigate('/'); // Navigate to the homepage on success
        } else {
            toast.error(res.msg); // Show error message
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center max-w-7xl mx-auto my-10">
                <div className="flex flex-col md:flex-row w-full border border-gray-200 rounded-md">
                    {/* Left side form */}
                    <form onSubmit={submitHandler} className="w-full md:w-1/2 p-8 bg-white">
                        <h1 className="font-bold text-xl mb-5 text-black">Login</h1>
                        <div className="my-2">
                            <Label className="text-black">Email</Label>
                            <Input
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                placeholder="name@gmail.com"
                                className="bg-gray-100 text-black"
                            />
                        </div>
                        <div className="my-2">
                            <Label className="text-black">Password</Label>
                            <Input
                                type="password"
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                placeholder="Password"
                                className="bg-gray-100 text-black"
                            />
                        </div>
                        <div className="flex items-center justify-between my-4">
                            <RadioGroup className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                    />
                                    <Label htmlFor="r1" className="text-black">Student</Label>
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
                                    <Label htmlFor="r2" className="text-black">Recruiter</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {/* <Button type="submit" className="w-full my-4 bg-gray-800 text-white">Login</Button> */}

                        <Button type="submit" className="w-full my-4 bg-gray-800 text-white">
                            {loading ? "Please wait..." : "Login"} {/* Loading message */}
                        </Button>
                        {loading && <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button>} {/* Loader */}
                        <span className="text-sm text-black">
                            Don&apos;t have an account? <Link to="/register" className="text-blue-600">Signup</Link>
                        </span>
                    </form>

                    {/* Vertical divider */}
                    <div className="hidden md:block w-0.5 bg-gray-400"></div>

                    {/* Right side Storyset image */}
                    <div className="hidden md:block w-full md:w-1/2 p-8 bg-white flex items-center justify-center">
                        <video
                            src={TabletLogin}
                            autoPlay
                            loop
                            alt="Illustration"
                            className="w-full h-96 object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

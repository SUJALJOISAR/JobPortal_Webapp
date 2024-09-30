import {useState} from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useAuth } from './AuthContext/authContext'
import PropTypes from 'prop-types'; // Import PropTypes

const UpdateProfileDialog = ({open,setOpen}) => {
    const { user, setUser } = useAuth(); // Destructure user and setUser from AuthContext
    const [loading, setLoading] = useState(false);

    const [input,setInput] =useState({
        name:user?.name || "",
        email:user?.email || "",
        phone:user?.phone || "",
        bio:user?.bio || "",
        skills:user?.skills || "",
        // skills: Array.isArray(user?.skills) ? user.skills.join(",") : "", // Check if skills is an array
        file:user?.resume || "",
    });

    const changeEventHandler = async(e)=>{
        setInput({...input,[e.target.name]:e.target.value});
    }

    const fileChangeHandler = async(e)=>{
        const file=e.target.files?.[0];
        setInput({...input,file});
    }

    const submitHandler = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("email", input.email);
        formData.append("phone", input.phone);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            // console.log("updateDialogFormData:",formData);
            const res=await axios.put('/user/updateProfile',formData);
            // console.log("Server response:", res.data);
            if(res.data.success){
                setUser(res.data.user); // Update user in AuthContext
                toast.success(res.data.msg);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.msg || 'Something went wrong');
        } finally {
            setLoading(false);
            setOpen(false); // Close the dialog
        }
    }

  return (
   <div>
            <Dialog open={open}>
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={input.name}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="number" className="text-right">Number</Label>
                                <Input
                                    id="number"
                                    name="number"
                                    value={input.phone}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="skills" className="text-right">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="file" className="text-right">Resume</Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            {
                                loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
  )
}

// Define the PropTypes for validation
UpdateProfileDialog.propTypes = {
    open: PropTypes.bool.isRequired,    // 'open' should be a boolean and is required
    setOpen: PropTypes.func.isRequired, // 'setOpen' should be a function and is required
  };

export default UpdateProfileDialog

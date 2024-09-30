import { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { useAuth } from './AuthContext/authContext'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'

const Profile = () => {
    const {user} = useAuth();
    const [open, setOpen] = useState(false);
    const isResume = true;
    // console.log("User from Profile.jsx",user);

    // const skillsArray = user?.skills ? user.skills.split(',') : [];
    const skillsArray = Array.isArray(user?.skills) ? user.skills : (user?.skills ? user.skills.split(',') : []);
    console.log(user?.resume);
     return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.name}</h1>
                            <p>{user?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phone}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1 className='font-bold'>Skills</h1>
                    <div className='flex items-center gap-1'>
                        {
                            skillsArray.length !== 0 ? skillsArray.map((item, index) => <Badge key={index}>{item}</Badge>) : <span></span>
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        isResume ? <a target='_blank' href={`http://localhost:5000/uploads/${user?.resumeOriginalName}`} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.resumeOriginalName}</a> : <span>NA</span>
                    }
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                {/* Applied Job Table   */}
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile

// import React from 'react';
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar"
import { LogOut, User2 } from 'lucide-react';
import { Link } from "react-router-dom";

const Navbar = () => {
    const user=false;
    return (
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                <div>
                    <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
                </div>
                <div className='flex itmes-center gap-12'>
                    <ul className='flex font-semibold items-center gap-5'>
                        <li>Home</li>
                        <li>Jobs</li>
                        <li>Browse</li>
                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to='/login'><Button variant="outline"><span className='from-neutral-800'>Login</span></Button> </Link>
                                <Link to='/register'><Button className='bg-[#6A38C2] hover:bg-[#5b30a6]'><span>Signup</span></Button></Link>
                            </div>
                        ) : ( 
                            <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className='cursor-pointer'>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className=''>
                                <div className='flex gap-2 space-y-2'>
                                    <Avatar className='cursor-pointer'>
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    </Avatar>
                                    <div>
                                        <h4 className='font-semibold'>Sujal</h4>
                                        <p className='text-sm text-muted-foreground'>Lorem ipsum dolor sit.</p>
                                    </div>
                                </div>
                                <div className='flex flex-col my-2 text-gray-600'>
                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                        <User2/>
                                        <Button variant="link"><span className='from-neutral-600'>View Profile</span></Button>
                                    </div>
                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                        <LogOut/>
                                        <Button variant="link"><span className='from-neutral-600'>Logout</span></Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>)
                    }
                   
                </div>
            </div>
        </div>
    )
}

export default Navbar

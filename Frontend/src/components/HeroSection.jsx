import { useState } from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const HeroSection = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    

    const searchJobHandler = () => {
        //Navigate to the Browse page with search term as a query parameter
        navigate(`/browse?keyword=${encodeURIComponent(search)}`);
    };

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>
                    The Leading Job Portal
                </span>
                <h1 className='text-5xl font-bold'>
                    Discover, Apply & <br /> Secure Your <span className='text-[#6A38C2]'>Dream Career</span>
                </h1>
                <p>
                    Unlock opportunities with top companies. Search through thousands of listings and find the perfect job that matches your skills and aspirations.
                </p>
                <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Search for your ideal job'
                        className='outline-none border-none w-full'
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2]">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;

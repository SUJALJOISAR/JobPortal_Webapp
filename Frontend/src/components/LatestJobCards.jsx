// import React from 'react'
import { Badge } from './ui/badge'
import PropTypes from 'prop-types'; // Importing PropTypes

const LatestJobCards = ({job}) => {
  return (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'>
            <div>
                <h1 className='font-medium text-lg'>{job?.company_name}</h1>
                <p className='text-sm text-gray-500'>India</p>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position}</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobtype}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
        </div>
  )
}

// Adding prop types validation
LatestJobCards.propTypes = {
    job: PropTypes.shape({
      company_name:PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      location: PropTypes.string,
      companyName: PropTypes.string,
      position: PropTypes.string,
      jobtype: PropTypes.string,
      salary: PropTypes.number,
    }).isRequired,
  };

export default LatestJobCards

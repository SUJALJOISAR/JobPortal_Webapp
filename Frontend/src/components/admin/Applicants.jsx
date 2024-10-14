import {useEffect,useState} from 'react'
import Navbar from '../shared/Navbar'
import { useParams } from 'react-router-dom';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';

const Applicants = () => {
    const {id} = useParams();
    const [applicants, setApplicants] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchApplicants = async () => {
            try {
                const response=await axios.get(`/application/applicants/${id}`);
                setApplicants(response.data.applications || []);
                setLoading(false);
                console.log("applicants data:",response);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        }

        fetchApplicants();
    },[id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

  return (
    <div>
    <Navbar />
    <div className='max-w-7xl mx-auto'>
        <h1 className='font-bold text-xl my-5'>Applicants ({applicants?.length})</h1>
        <ApplicantsTable applicants={applicants}/>
    </div>
</div>
  )
}

export default Applicants

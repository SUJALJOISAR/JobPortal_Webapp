import {useState} from 'react' 
import {RadioGroup, RadioGroupItem} from '../ui/radio-group';
import { Label } from '../ui/label';

const filterData= [
   {
    filterType:"Location",
    array:["Banglore","Hyderbad","Pune","Vadodara","Ahemdabad","Surat","Rajkot","Mumbai"]
   },
   {
    filterType:"Industry",
    array:["Frontend Developer","Backend Developer","MernStack Developer","Data Science Engineer","UI/UX Developer"]
   } ,
   {
    filterType:"Salary",
    array:["0-40k","42-1lakh","1lakh-5lakh"]
   }
]

const FilterCard = ({onFilterChange}) => {
  const [selectedFilter, setSelectedFilter] = useState({
    Location:'',
    Industry:'',
    Salary:''
  });

  //update selected filters when a radio button is clicked
  const handleFilterChange = (type,value)=>{
    const updatedFilters = {...selectedFilter,[type]:value};
    setSelectedFilter(updatedFilters);
    onFilterChange(updatedFilters);//Notify the parent component about filter changes means there is a function name onFilterChange(getfilter) in parent component which will execute after the filters are selected 
  }

  return (
    <div className='w-full bg-white p-3 rounded-md'>
      <h1 className='font-bold text-lg'>Filter Jobs</h1>
      <hr className="mt-3"/>
      <RadioGroup>
        {filterData.map((item, index) => (
            <div>
                <h1 className="font-bold text-lg">{item.filterType}</h1>
                {
                    item.array.map((arrayItem, index) => {
                        return(
                            <div className='flex items-center space-x-2 my-2'>
                                <RadioGroupItem value={arrayItem} onClick={()=>handleFilterChange(item.filterType,arrayItem)} //send selected filter 
                                 /> 
                                <Label>{arrayItem}</Label>
                            </div>        
                        )
                    })
                }
            </div>
        ))
        }
      </RadioGroup>
    </div>
  )
}

export default FilterCard

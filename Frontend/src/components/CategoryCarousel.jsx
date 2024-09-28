import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science Engineer",
    "UI/UX Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => {
    // const navigate = useNavigate();

    // const searchJobHandler = (query) => {
    //     // dispatch(setSearchedQuery(query));
    //     // navigate("/browse");
    // }
  return (
    <div>
    <Carousel className="w-full max-w-xl mx-auto my-20">
        <CarouselContent>
            {
                category.map((cat, index) => (
                    <CarouselItem className="md:basis-1/2 lg-basis-1/3">
                        <Button variant="outline" className="rounded-full font-semibold">{cat}</Button>
                        {/* onClick={()=>searchJobHandler(cat)}  */}
                    </CarouselItem>
                ))
            }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
    </Carousel>
</div>
  )
}

export default CategoryCarousel

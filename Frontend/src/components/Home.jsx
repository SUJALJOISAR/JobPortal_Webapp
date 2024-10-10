import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext/authContext";
import CategoryCarousel from "./CategoryCarousel";
import HeroSection from "./HeroSection";
import LatestJobs from "./LatestJobs";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";

const Home = () => {
  const { user } = useAuth(); // Get user data from auth context
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    // Redirect recruiter to /admin/companies
    if (user?.role === 'recruiter') {
      navigate('/admin/companies');
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </div>
  );
};

export default Home;

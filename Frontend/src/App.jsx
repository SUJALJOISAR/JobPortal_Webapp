import { Routes,Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/Companies";
import AdminJobs from "./components/admin/AdminJobs";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import PostJob from "./components/admin/PostJob";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/description/:id" element={<JobDescription />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin/companies" element={<Companies />} />
      <Route path="/admin/jobs" element={<AdminJobs />} />
      <Route path="/admin/jobs/create" element={<PostJob />} />
      <Route path="/admin/companies/create" element={<CompanyCreate />} />
      <Route path="/admin/companies/:id" element={<CompanySetup />} />
    </Routes>
    </>
  );
}

export default App;

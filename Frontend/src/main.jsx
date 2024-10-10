import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import axios from 'axios'
import { Toaster } from './components/ui/sonner.jsx'
import { AuthProvider } from './components/AuthContext/authContext.jsx'
import { JobProvider } from './components/AuthContext/jobContext.jsx'
import { CompanyProvider } from './components/AuthContext/companyContext.jsx'

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <JobProvider>
          <BrowserRouter>
          <CompanyProvider>
            <App />
            <Toaster />
            </CompanyProvider>
          </BrowserRouter>
      </JobProvider>
    </AuthProvider>
  </StrictMode>,
)

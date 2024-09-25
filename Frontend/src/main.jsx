import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import axios from 'axios'
import { Toaster } from './components/ui/sonner.jsx'
import { AuthProvider } from './components/AuthContext/authContext.jsx'

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = false;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)

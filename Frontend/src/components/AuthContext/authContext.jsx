import { createContext, useState, useContext } from "react";
import axios from "axios";
import { toast } from "sonner";
import PropTypes from 'prop-types';
import { useEffect } from "react";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // Load user from the backend when the component mounts
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/user/profile'); // New route to fetch user profile
                if (response.data.success) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (input) => {
        setLoading(true);
        try {
            const res = await axios.post('/user/login', input, { withCredentials: true });
            if (res.data.success) {
                setUser(res.data.user);//Assuming the user data is returned
                // Store the token in localStorage
                localStorage.setItem('token', res.data.token);
                toast.success(res.data.msg);
            }
            return res.data;
        } catch (error) {
            console.log(error);
            return { success: false, msg: 'Login Failed.Please Check your Credentials' };
        } finally {
            setLoading(false);
        }
    }

    const register = async (userData) => {
        try {
            const res = await axios.post('/user/register', userData);
            if (res.data.success) {
                setUser(res.data.user);//set user data in context
                toast.success(res.data.msg);
                return res.data;//return the response data
            }
        } catch (error) {
            toast.error("Registration failed. Please try again.");
            console.error("Registration Error: ", error);
            return { success: false, msg: 'Registration failed due to an error.' }; // Return error response
        }
    }

    const logout = async () => {
        try {
            await axios.get('/user/logout');
            setUser(null);
            localStorage.removeItem('token');
            toast.success("Logged out Successfully!");
        } catch (error) {
            toast.error("Logout failed. Please try again.");
            console.error("Logout Error: ", error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    return useContext(AuthContext);
}
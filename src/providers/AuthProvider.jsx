import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Firebase Client SDK Imports
import { auth } from '../firebase/firebase.config'; // Import auth instance
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // Import Google Auth provider and signInWithPopup

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    const setAuthHeader = useCallback((token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, []);

    const loadUserFromStorage = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthHeader(token);
            try {
                const response = await axios.get(`${API_BASE_URL}/auth/profile`);
                setUser(response.data.user);
            } catch (error) {
                console.error('Failed to load user from storage or token invalid:', error);
                localStorage.removeItem('token');
                setUser(null);
                setAuthHeader(null);
                if (error.response && error.response.status === 401) {
                    toast.error('Session expired. Please log in again.');
                }
            }
        }
        setLoading(false);
    }, [API_BASE_URL, setAuthHeader]);

    useEffect(() => {
        loadUserFromStorage();
    }, [loadUserFromStorage]);

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
            const { token, user: registeredUser } = response.data;
            localStorage.setItem('token', token);
            setUser(registeredUser);
            setAuthHeader(token);
            toast.success(response.data.message);
            navigate('/');
            return true;
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Registration failed.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
            const { token, user: loggedInUser } = response.data;
            localStorage.setItem('token', token);
            setUser(loggedInUser);
            setAuthHeader(token);
            toast.success(response.data.message);
            navigate('/');
            return true;
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Login failed.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // --- NEW: Google Sign-In Function ---
    const googleSignIn = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken(); // Get Firebase ID Token

            // Send Firebase ID Token to your backend for verification and custom JWT generation
            const response = await axios.post(`${API_BASE_URL}/auth/google-signin`, { idToken });
            const { token, user: loggedInUser } = response.data;

            localStorage.setItem('token', token);
            setUser(loggedInUser);
            setAuthHeader(token);
            toast.success(response.data.message);
            navigate('/');
            return true;
        } catch (error) {
            console.error('Google Sign-In failed:', error);
            // Handle specific Firebase errors
            if (error.code === 'auth/popup-closed-by-user') {
                toast.error('Google Sign-In cancelled.');
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Google Sign-In failed. Please try again.');
            }
            return false;
        } finally {
            setLoading(false);
        }
    };


    const logout = () => {
        localStorage.removeItem('token');
        setAuthHeader(null);
        setUser(null);
        toast.success('Logged out successfully!');
        navigate('/login');
    };

    const updateUserProfile = async (userData) => {
        try {
            setLoading(true);
            const response = await axios.put(`${API_BASE_URL}/auth/profile`, userData);
            setUser(response.data.user);
            toast.success(response.data.message);
            return true;
        } catch (error) {
            console.error('Profile update failed:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Profile update failed.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateAuthUser = useCallback((updatedUserData) => {
        setUser(prevUser => ({ ...prevUser, ...updatedUserData }));
    }, []);

    const isAdmin = user?.role === 'admin';
    const isPremium = user?.premiumTaken !== null;

    const authInfo = {
        user,
        loading,
        register,
        login,
        googleSignIn, // Expose googleSignIn function
        logout,
        updateUserProfile,
        updateAuthUser,
        isAdmin,
        isPremium
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined || Object.keys(context).length === 0) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
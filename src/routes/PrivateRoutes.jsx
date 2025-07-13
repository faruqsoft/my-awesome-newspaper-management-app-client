import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider'; // Your AuthProvider hook
import Loader from '../components/shared/Loader'; // You'll create this component

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader />; // Show a loading spinner while checking auth status
    }

    if (!user) {
        // If not logged in, redirect to the login page, but store the current location
        // so they can be redirected back after logging in.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoutes;
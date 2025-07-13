import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import Loader from '../components/shared/Loader';
import { toast } from 'react-hot-toast';

const AdminRoutes = ({ children }) => {
    const { user, loading, isAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader />;
    }

    // If user is not logged in OR is not an admin, redirect
    if (!user || !isAdmin) {
        toast.error('You do not have administrative access.');
        // Redirect to home or login based on current auth state
        return <Navigate to={user ? '/' : '/login'} state={{ from: location }} replace />;
    }

    return children;
};

export default AdminRoutes;
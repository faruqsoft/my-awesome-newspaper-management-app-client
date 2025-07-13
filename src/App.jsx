import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all your page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AllArticles from './pages/AllArticles';
import ArticleDetails from './pages/ArticleDetails';
import AddArticle from './pages/AddArticle';
import Subscription from './pages/Subscription';
import PremiumArticles from './pages/PremiumArticles'; // Important: Keep this import
import MyProfile from './pages/MyProfile';
import MyArticles from './pages/MyArticles';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AllUsers from './pages/admin/AllUsers';
import AllArticlesAdmin from './pages/admin/AllArticlesAdmin';
import AddPublisher from './pages/admin/AddPublisher';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Route Wrappers
import PrivateRoutes from './routes/PrivateRoutes';
import AdminRoutes from './routes/AdminRoutes';

import NotFound from './pages/NotFound';


const App = () => {
    return (
        <Routes>
            {/* Main Layout for public and private routes */}
            <Route path="/" element={<MainLayout />}>
                {/* Public Routes */}
                <Route index element={<Home />} />
                <Route path="articles" element={<AllArticles />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                {/* IMPORTANT FIX: Place specific routes before general dynamic routes */}
                {/* Private Routes */}
                <Route path="add-article" element={<PrivateRoutes><AddArticle /></PrivateRoutes>} />
                <Route path="subscription" element={<PrivateRoutes><Subscription /></PrivateRoutes>} />
                <Route path="my-profile" element={<PrivateRoutes><MyProfile /></PrivateRoutes>} />
                <Route path="my-articles" element={<PrivateRoutes><MyArticles /></PrivateRoutes>} />

                {/* Ensure PremiumArticles is defined BEFORE articles/:id */}
                <Route path="premium-articles" element={<PrivateRoutes><PremiumArticles /></PrivateRoutes>} />
                <Route path="articles/:id" element={<PrivateRoutes><ArticleDetails /></PrivateRoutes>} /> {/* This must come AFTER static paths that might be mistaken as IDs */}


                {/* Admin Routes - Nested under AdminLayout and wrapped with AdminRoutes */}
                <Route path="dashboard" element={<AdminRoutes><AdminLayout /></AdminRoutes>}>
                    <Route index element={<Dashboard />} />
                    <Route path="all-users" element={<AllUsers />} />
                    <Route path="all-articles" element={<AllArticlesAdmin />} />
                    <Route path="add-publisher" element={<AddPublisher />} />
                </Route>
            </Route>

            {/* Catch-all route for 404 Not Found pages */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AllArticles from '../pages/AllArticles';
import ArticleDetails from '../pages/ArticleDetails';
import AddArticle from '../pages/AddArticle';
import Subscription from '../pages/Subscription';
import PremiumArticles from '../pages/PremiumArticles';
import MyProfile from '../pages/MyProfile';
import MyArticles from '../pages/MyArticles';
import Dashboard from '../pages/admin/Dashboard';
import AllUsers from '../pages/admin/AllUsers';
import AllArticlesAdmin from '../pages/admin/AllArticlesAdmin';
import AddPublisher from '../pages/admin/AddPublisher';
import NotFound from '../pages/NotFound';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout'; // For admin dashboard nested routes

// Private & Admin Route Wrappers
import PrivateRoutes from './PrivateRoutes';
import AdminRoutes from './AdminRoutes';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                {/* Public Routes */}
                <Route index element={<Home />} />
                <Route path="articles" element={<AllArticles />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="404" element={<NotFound />} /> {/* Custom 404 page */}

                {/* Private Routes */}
                <Route path="add-article" element={<PrivateRoutes><AddArticle /></PrivateRoutes>} />
                <Route path="articles/:id" element={<PrivateRoutes><ArticleDetails /></PrivateRoutes>} />
                <Route path="subscription" element={<PrivateRoutes><Subscription /></PrivateRoutes>} />
                <Route path="premium-articles" element={<PrivateRoutes><PremiumArticles /></PrivateRoutes>} />
                <Route path="my-profile" element={<PrivateRoutes><MyProfile /></PrivateRoutes>} />
                <Route path="my-articles" element={<PrivateRoutes><MyArticles /></PrivateRoutes>} />

                {/* Admin Routes (nested under a common admin layout) */}
                <Route path="dashboard" element={<AdminRoutes><AdminLayout /></AdminRoutes>}>
                    <Route index element={<Dashboard />} /> {/* Admin Dashboard homepage */}
                    <Route path="all-users" element={<AllUsers />} />
                    <Route path="all-articles" element={<AllArticlesAdmin />} />
                    <Route path="add-publisher" element={<AddPublisher />} />
                </Route>

            </Route>

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
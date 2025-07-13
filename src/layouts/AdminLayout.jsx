import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/dashboard" className="block py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200">
                                Dashboard Overview
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/all-users" className="block py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200">
                                All Users
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/all-articles" className="block py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200">
                                All Articles
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/add-publisher" className="block py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200">
                                Add Publisher
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow p-6">
                <Outlet /> {/* This is where nested admin routes will render */}
            </div>
        </div>
    );
};

export default AdminLayout;
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider'; // Import useAuth

const Navbar = () => {
    const { user, logout, loading, isAdmin, isPremium } = useAuth(); // Destructure from useAuth

    return (
        <nav className="bg-blue-600 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">MyNewsApp</Link>
                <div className="flex space-x-4 items-center">
                    <Link to="/" className="hover:text-blue-200">Home</Link>
                    <Link to="/add-article" className="hover:text-blue-200">Add Article</Link>
                    <Link to="/articles" className="hover:text-blue-200">All Articles</Link>
                    <Link to="/subscription" className="hover:text-blue-200">Subscription</Link>

                    {/* Conditional Links based on Auth State */}
                    {loading ? (
                        <span>Loading...</span> // Show loading state for links
                    ) : (
                        <>
                            {isAdmin && (
                                <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
                            )}
                            {user && isPremium && ( // Only show if logged in AND premium
                                <Link to="/premium-articles" className="hover:text-blue-200">Premium Articles</Link>
                            )}

                            {user ? (
                                <div className="flex items-center space-x-2">
                                    <Link to="/my-profile" className="flex items-center space-x-2">
                                        <img
                                            src={user.photoURL || 'https://i.ibb.co/L15L23N/default-avatar.png'}
                                            alt="User Avatar"
                                            className="w-8 h-8 rounded-full border-2 border-white"
                                        />
                                        <span className="hidden md:inline">{user.displayName}</span> {/* Optional: show name on larger screens */}
                                    </Link>
                                    <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800">Login</Link>
                                    <Link to="/register" className="bg-green-600 px-3 py-1 rounded hover:bg-green-700">Register</Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
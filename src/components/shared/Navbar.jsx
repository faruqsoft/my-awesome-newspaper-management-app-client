import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Use NavLink for active states
import { useAuth } from '../../providers/AuthProvider';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // For mobile menu icon

const Navbar = () => {
    const { user, logout, loading, isAdmin, isPremium } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

    // Common styling for NavLink
    const navLinkClasses = ({ isActive }) =>
        `py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive ? 'bg-blue-700 text-white shadow-inner' : 'hover:bg-blue-700 hover:text-blue-100'
        }`;

    // Common styling for mobile NavLink
    const mobileNavLinkClasses = ({ isActive }) =>
        `block py-2 px-4 text-white text-base font-medium rounded-md transition-colors duration-200 ${
            isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
        }`;

    return (
        <nav className="bg-blue-600 shadow-xl sticky top-0 relative z-50"> {/* Increased z-index */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-white text-3xl font-extrabold tracking-tight hover:text-blue-100 transition-colors duration-200">
                            MyNewsApp
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <NavLink to="/" className={navLinkClasses}>Home</NavLink>
                        <NavLink to="/articles" className={navLinkClasses}>All Articles</NavLink>
                        {/* Always show Add Article, but it's a private route handled by router */}
                        <NavLink to="/add-article" className={navLinkClasses}>Add Article</NavLink>
                        <NavLink to="/subscription" className={navLinkClasses}>Subscription</NavLink>

                        {/* Conditional Links based on Auth State */}
                        {loading ? (
                            <span className="text-white text-sm">Loading...</span>
                        ) : (
                            <>
                                {isAdmin && ( // Dashboard for Admin only
                                    <NavLink to="/dashboard" className={navLinkClasses}>Dashboard</NavLink>
                                )}
                                {user && ( // My Articles for any logged-in user
                                    <NavLink to="/my-articles" className={navLinkClasses}>My Articles</NavLink>
                                )}
                                {user && isPremium && ( // Premium Articles for logged-in premium user
                                    <NavLink to="/premium-articles" className={navLinkClasses}>Premium Articles</NavLink>
                                )}
                            </>
                        )}
                    </div>

                    {/* User Profile / Auth Buttons (Desktop) */}
                    <div className="hidden md:block">
                        {loading ? (
                            <span className="text-white text-sm">Loading user...</span>
                        ) : (
                            user ? (
                                <div className="flex items-center space-x-3">
                                    {/* User Photo Link to My Profile */}
                                    <Link to="/my-profile" className="flex items-center space-x-2 p-1 rounded-full hover:bg-blue-700 transition-colors duration-200">
                                        <img
                                            src={user.photoURL || 'https://i.ibb.co/L15L23N/default-avatar.png'}
                                            alt="User Avatar"
                                            className="w-9 h-9 rounded-full border-2 border-white shadow-md transition-transform duration-200 transform hover:scale-110"
                                        />
                                        <span className="text-white text-sm font-medium hidden lg:inline">{user.displayName}</span>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="bg-red-500 px-4 py-2 rounded-md text-white text-sm font-medium hover:bg-red-600 transition-colors duration-200 shadow-md"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link to="/login" className="bg-blue-700 px-4 py-2 rounded-md text-white text-sm font-medium hover:bg-blue-800 transition-colors duration-200 shadow-md">
                                        Login
                                    </Link>
                                    <Link to="/register" className="bg-green-500 px-4 py-2 rounded-md text-white text-sm font-medium hover:bg-green-600 transition-colors duration-200 shadow-md">
                                        Register
                                    </Link>
                                </div>
                            )
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <div
                className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} absolute w-full bg-blue-600 pb-3 shadow-lg transition-all duration-300 ease-in-out`}
                style={{ maxHeight: isMobileMenuOpen ? '500px' : '0px', overflow: 'hidden' }} // Smooth transition for height
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <NavLink to="/" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/articles" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>All Articles</NavLink>
                    <NavLink to="/add-article" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Add Article</NavLink>
                    <NavLink to="/subscription" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Subscription</NavLink>

                    {loading ? (
                        <span className="block px-4 py-2 text-white text-base">Loading...</span>
                    ) : (
                        <>
                            {isAdmin && (
                                <NavLink to="/dashboard" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</NavLink>
                            )}
                            {user && ( // My Articles for any logged-in user
                                <NavLink to="/my-articles" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>My Articles</NavLink>
                            )}
                            {user && isPremium && (
                                <NavLink to="/premium-articles" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Premium Articles</NavLink>
                            )}

                            {/* Mobile User Profile / Auth Buttons */}
                            {user ? (
                                <>
                                    <NavLink to="/my-profile" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={user.photoURL || 'https://i.ibb.co/L15L23N/default-avatar.png'}
                                                alt="User Avatar"
                                                className="w-8 h-8 rounded-full border border-white"
                                            />
                                            <span>{user.displayName} (My Profile)</span>
                                        </div>
                                    </NavLink>
                                    <button
                                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                        className="w-full text-left bg-red-500 block py-2 px-4 rounded-md text-white text-base font-medium hover:bg-red-600 transition-colors duration-200 mt-2"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="bg-blue-700 block py-2 px-4 rounded-md text-white text-base font-medium hover:bg-blue-800 transition-colors duration-200 mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                                        Login
                                    </Link>
                                    <Link to="/register" className="bg-green-500 block py-2 px-4 rounded-md text-white text-base font-medium hover:bg-green-600 transition-colors duration-200 mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                                        Register
                                    </Link>
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
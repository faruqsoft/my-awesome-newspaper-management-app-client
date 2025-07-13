import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
            <h1 className="text-9xl font-extrabold text-gray-700 mb-4">404</h1>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-8">
                Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition duration-300 shadow-lg"
            >
                Go to Homepage
            </Link>
        </div>
    );
};

export default NotFound;
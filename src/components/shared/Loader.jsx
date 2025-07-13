import React from 'react';

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full bg-gray-50 bg-opacity-75 z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <p className="ml-4 text-lg text-gray-700">Loading...</p>
        </div>
    );
};

export default Loader;
import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50">
            <div className="relative">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent animate-spin"></div>
                
                {/* Middle ring */}
                <div className="absolute inset-2 rounded-full border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin-reverse"></div>
                
                {/* Inner ring */}
                <div className="absolute inset-4 rounded-full border-4 border-t-pink-500 border-r-pink-500 border-b-transparent border-l-transparent animate-spin"></div>
                
                {/* Center pulse */}
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
            </div>
        </div>
    );
};

export default Loader;
import React from 'react';

const Home = () => {
    return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-5xl font-bold text-blue-700 mb-6">Welcome to MyNewsApp!</h1>
            <p className="text-xl text-gray-700 mb-8">Your daily source for trending articles and insights.</p>
            <div className="bg-gray-200 p-10 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold mb-4">Homepage Content Coming Soon!</h2>
                <p className="text-lg text-gray-600">
                    This is a placeholder for your Home page content, including:
                </p>
                <ul className="list-disc list-inside mt-4 text-left inline-block">
                    <li>Trending Articles Slider</li>
                    <li>All Publishers Section</li>
                    <li>Statistics (Users, Premium Users)</li>
                    <li>Subscription Plans</li>
                    <li>Two extra unique sections</li>
                    <li>Homepage Subscription Modal (after 10s)</li>
                </ul>
            </div>
        </div>
    );
};

export default Home;
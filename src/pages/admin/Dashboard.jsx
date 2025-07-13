import React from 'react';

const Dashboard = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard Overview</h1>
            <p className="text-lg text-gray-700 mb-4">
                This is the central hub for administrators. Here you will find:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Dynamic Pie Chart showing article distribution by publisher.</li>
                <li>At least two more different static charts (e.g., Bar Chart, Line Chart).</li>
                <li>Links to manage users, articles, and publishers via the sidebar.</li>
            </ul>
            <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h2 className="text-2xl font-semibold text-blue-800 mb-3">Chart Section (Coming Soon)</h2>
                <p className="text-blue-700">
                    Implement your `react-google-charts` here to display various statistics.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
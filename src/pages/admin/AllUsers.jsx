import React from 'react';

const AllUsers = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Manage All Users</h1>
            <p className="text-lg text-gray-700 mb-4">
                This page will display a table of all registered users with their details.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>User Name, Email, Profile Picture.</li>
                <li>"Make Admin" button to change user roles.</li>
                <li>Pagination for large user lists.</li>
            </ul>
            <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
                <h2 className="text-2xl font-semibold text-green-800 mb-3">User Table (Coming Soon)</h2>
                <p className="text-green-700">
                    Implement your user table and "Make Admin" functionality here.
                </p>
            </div>
        </div>
    );
};

export default AllUsers;
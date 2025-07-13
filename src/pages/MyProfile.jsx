import React from 'react';
import { useAuth } from '../providers/AuthProvider';

const MyProfile = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="text-center p-8">Loading profile...</div>;
    }

    if (!user) {
        return <div className="text-center p-8 text-red-600">Please log in to view your profile.</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">My Profile</h1>
                <img
                    src={user.photoURL || 'https://i.ibb.co/L15L23N/default-avatar.png'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-blue-400 shadow-md"
                />
                <p className="text-2xl font-semibold text-gray-700 mb-2">Name: {user.displayName}</p>
                <p className="text-lg text-gray-600 mb-2">Email: {user.email}</p>
                <p className="text-lg text-gray-600 mb-4">Role: <span className="font-bold capitalize">{user.role}</span></p>
                <p className="text-lg text-gray-600 mb-6">
                    Subscription Status: {user.premiumTaken ?
                        <span className="font-bold text-green-600">Premium (Since {new Date(user.premiumTaken).toLocaleDateString()})</span> :
                        <span className="font-bold text-red-600">Normal User</span>
                    }
                </p>
                <button className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 font-semibold transition duration-200">
                    Update Profile (Coming Soon)
                </button>
            </div>
        </div>
    );
};

export default MyProfile;
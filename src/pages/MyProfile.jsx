import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // For profile update
import { toast } from 'react-hot-toast';
import Modal from 'react-modal'; // For the update profile modal
import { XMarkIcon, PencilSquareIcon } from '@heroicons/react/24/outline'; // Icons for edit/close

// Set app element for react-modal (important for accessibility)
Modal.setAppElement('#root');

const MyProfile = () => {
    const { user, loading, updateUserProfile, updateAuthUser } = useAuth(); // Destructure updateUserProfile and updateAuthUser
    const queryClient = useQueryClient(); // To potentially invalidate queries if needed

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    // State for image file if you want to allow direct file upload for profile pic
    // const [profileImageFile, setProfileImageFile] = useState(null);
    // const [previewProfileImage, setPreviewProfileImage] = useState(null);

    // Initialize form fields when modal opens or user data changes
    React.useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setPhotoURL(user.photoURL || '');
            // setPreviewProfileImage(user.photoURL || null);
        }
    }, [user]);

    // Mutation for updating user profile
    const profileUpdateMutation = useMutation({
        mutationFn: updateUserProfile, // This function comes from AuthProvider
        onSuccess: (data) => {
            toast.success(data.message);
            // AuthProvider's updateUserProfile already calls updateAuthUser internally,
            // so local state (user) in AuthProvider is updated.
            // No need to manually invalidate here, as AuthProvider handles it.
            setIsUpdateModalOpen(false); // Close modal on success
        },
        onError: (error) => {
            console.error('Profile update failed:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        },
    });

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        // Prepare data to send (currently only displayName and photoURL)
        const updatedData = {
            displayName: displayName.trim(),
            photoURL: photoURL.trim()
            // If you add file upload for profile pic:
            // profileImageFile: profileImageFile
        };

        profileUpdateMutation.mutate(updatedData);
    };

    // Helper to format premium taken date
    const formatPremiumDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    // --- Loading State ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-800">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="ml-4 text-xl">Loading profile...</p>
            </div>
        );
    }

    // --- Not Logged In State ---
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-2xl border border-red-300 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-6 leading-tight">
                        Access Denied! 🚫
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-md mx-auto">
                        You need to be logged in to view your profile.
                    </p>
                    <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 text-lg md:text-xl">
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    // --- My Profile Display ---
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 py-10 px-4 sm:px-6 lg:px-8 flex items-start justify-center">
            <div className="max-w-3xl w-full bg-white p-8 md:p-10 rounded-xl shadow-2xl border border-gray-200 text-center relative">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-8 leading-tight">
                    My Profile 👤
                </h1>

                {/* Edit Profile Button */}
                <button
                    onClick={() => setIsUpdateModalOpen(true)}
                    className="absolute top-6 right-6 p-3 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 transition-colors duration-200 shadow-md transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Edit Profile"
                >
                    <PencilSquareIcon className="h-6 w-6" />
                </button>

                <div className="flex flex-col items-center mb-8">
                    <img
                        src={user.photoURL || 'https://i.ibb.co/L15L23N/default-avatar.png'}
                        alt="Profile Avatar"
                        className="w-36 h-36 rounded-full object-cover border-4 border-blue-400 shadow-xl mb-4"
                    />
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">{user.displayName}</h2>
                    <p className="text-lg text-gray-600">{user.email}</p>
                </div>

                <div className="text-left space-y-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center shadow-sm">
                        <span className="font-semibold text-gray-700 w-1/3 md:w-1/4">Role:</span>
                        <span className="capitalize text-gray-800 font-medium flex-grow">{user.role}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center shadow-sm">
                        <span className="font-semibold text-gray-700 w-1/3 md:w-1/4">Account Created:</span>
                        <span className="text-gray-800 flex-grow">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center shadow-sm">
                        <span className="font-semibold text-gray-700 w-1/3 md:w-1/4">Subscription:</span>
                        {user.premiumTaken ? (
                            <span className="font-bold text-green-600 flex-grow">
                                Premium (Since {formatPremiumDate(user.premiumTaken)})
                            </span>
                        ) : (
                            <span className="font-bold text-red-600 flex-grow">Normal User</span>
                        )}
                    </div>
                </div>

                {/* You can add more profile details or actions here */}
                {user.premiumTaken ? (
                    <p className="text-center text-gray-600 text-base">
                        Enjoy your premium benefits!
                    </p>
                ) : (
                    <Link to="/subscription" className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105">
                        Upgrade to Premium
                    </Link>
                )}
            </div>

            {/* Update Profile Modal */}
            <Modal
                isOpen={isUpdateModalOpen}
                onRequestClose={() => setIsUpdateModalOpen(false)}
                contentLabel="Update Profile"
                className="ReactModal__Content p-8 md:p-10 rounded-xl shadow-2xl bg-gray-200 relative outline-none max-w-lg mx-auto my-20 border border-gray-300"
                overlayClassName="ReactModal__Overlay fixed inset-0 flex justify-center items-center z-[9999]"
            >
                <button
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold transition-transform duration-200 transform hover:rotate-90"
                >
                    <XMarkIcon className="h-7 w-7" />
                </button>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Update Profile</h2>
                <form onSubmit={handleUpdateSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="updateDisplayName" className="block text-lg font-semibold text-gray-700 mb-3">Display Name</label>
                        <input
                            type="text"
                            id="updateDisplayName"
                            className="w-full px-5 py-3 bg-gray-700" /* Global input styles */
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="updatePhotoURL" className="block text-lg font-semibold text-gray-700 mb-3">Photo URL</label>
                        <input
                            type="url"
                            id="updatePhotoURL"
                            className="w-full px-5 py-3 bg-gray-700" /* Global input styles */
                            placeholder="e.g., https://example.com/your-new-photo.jpg"
                            value={photoURL}
                            onChange={(e) => setPhotoURL(e.target.value)}
                        />
                        {/* Optional: Add a file upload input here if you want users to upload photos */}
                        {/* <div>
                            <label htmlFor="uploadProfileImage" className="block text-lg font-semibold text-gray-700 mb-3">Upload New Photo (Optional)</label>
                            <input
                                type="file"
                                id="uploadProfileImage"
                                accept="image/*"
                                className="w-full text-base text-gray-700"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setProfileImageFile(file);
                                    if (file) setPreviewProfileImage(URL.createObjectURL(file));
                                    else setPreviewProfileImage(user.photoURL || null);
                                }}
                            />
                            {previewProfileImage && (
                                <div className="mt-4 flex justify-center">
                                    <img src={previewProfileImage} alt="New Photo Preview" className="w-24 h-24 rounded-full object-cover border border-gray-300" />
                                </div>
                            )}
                        </div> */}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                        disabled={profileUpdateMutation.isLoading}
                    >
                        {profileUpdateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default MyProfile;
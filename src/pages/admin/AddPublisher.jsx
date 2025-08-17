import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast'; // For notifications
import { addPublisher } from '../../services/publisherApi';

const AddPublisher = () => {
    const queryClient = useQueryClient();
    const [publisherName, setPublisherName] = useState('');
    const [publisherLogo, setPublisherLogo] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);

    // Handles logo file selection and creates a preview URL with validation
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Client-side validation for file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Invalid file type. Please select an image (JPEG, PNG, GIF, WebP).');
                setPublisherLogo(null);
                setPreviewLogo(null);
                e.target.value = ''; // Clear file input
                return;
            }
            // Client-side validation for file size (e.g., 2MB limit for logos)
            const maxSize = 2 * 1024 * 1024; // 2 MB
            if (file.size > maxSize) {
                toast.error('Logo size exceeds 2MB. Please choose a smaller image.');
                setPublisherLogo(null);
                setPreviewLogo(null);
                e.target.value = ''; // Clear file input
                return;
            }

            setPublisherLogo(file);
            setPreviewLogo(URL.createObjectURL(file)); // Create a URL for image preview
        } else {
            setPublisherLogo(null);
            setPreviewLogo(null);
        }
    };

    // TanStack Mutation for adding a publisher
    const addPublisherMutation = useMutation({
        mutationFn: addPublisher,
        onSuccess: (data) => {
            toast.success(data.message);
            // Clear form fields on successful submission
            setPublisherName('');
            setPublisherLogo(null);
            setPreviewLogo(null);
            queryClient.invalidateQueries(['publishers']); // Invalidate cache to refetch publishers in other components
        },
        onError: (error) => {
            console.error('Failed to add publisher:', error);
            // Display error message from backend or a generic one
            toast.error(error.response?.data?.message || 'Failed to add publisher. Please try again.');
        },
    });

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic client-side validation
        if (!publisherName.trim()) {
            toast.error('Publisher Name is required.');
            return;
        }
        if (!publisherLogo) {
            toast.error('Publisher Logo is required. Please select a logo file.');
            return;
        }

        const formData = new FormData();
        formData.append('name', publisherName);
        formData.append('logo', publisherLogo); // Append the actual file

        addPublisherMutation.mutate(formData); // Trigger the mutation
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="max-w-xl w-full"> {/* Responsive max-width and full width */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-gray-800 leading-tight">
                    Add New Publisher 🏢
                </h1>
                <p className="text-center text-lg text-gray-600 mb-12 max-w-lg mx-auto">
                    Register a new publisher on your platform. Articles can then be associated with this publisher.
                </p>

                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-xl shadow-lg space-y-8 border border-gray-200">
                    {/* Publisher Name */}
                    <div>
                        <label htmlFor="publisherName" className="block text-lg font-semibold text-gray-700 mb-3">Publisher Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="publisherName"
                            className="w-full px-5 py-3" /* Global input styles from index.css */
                            placeholder="e.g., The Daily Chronicle"
                            value={publisherName}
                            onChange={(e) => setPublisherName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Publisher Logo */}
                    <div>
                        <label htmlFor="publisherLogo" className="block text-lg font-semibold text-gray-700 mb-3">Publisher Logo <span className="text-red-500">*</span></label>
                        <input
                            type="file"
                            id="publisherLogo"
                            accept="image/jpeg,image/png,image/gif,image/webp" // Specific accepted file types
                            className="w-full text-base text-gray-700" /* Global file input styles from index.css */
                            onChange={handleLogoChange}
                            required={!previewLogo}
                        />
                        {previewLogo && (
                            <div className="mt-6 flex justify-center">
                                <img src={previewLogo} alt="Logo Preview" className="max-w-[180px] h-auto rounded-lg shadow-md border border-gray-300 object-cover p-1" />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3.5 px-8 rounded-lg font-bold text-xl shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={addPublisherMutation.isLoading}
                    >
                        {addPublisherMutation.isLoading ? 'Adding Publisher...' : 'Add Publisher'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPublisher;
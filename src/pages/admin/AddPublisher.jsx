import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { addPublisher } from '../../services/publisherApi';

const AddPublisher = () => {
    const queryClient = useQueryClient();
    const [publisherName, setPublisherName] = useState('');
    const [publisherLogo, setPublisherLogo] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPublisherLogo(file);
            setPreviewLogo(URL.createObjectURL(file)); // Create a URL for image preview
        } else {
            setPublisherLogo(null);
            setPreviewLogo(null);
        }
    };

    const addPublisherMutation = useMutation({
        mutationFn: addPublisher,
        onSuccess: (data) => {
            toast.success(data.message);
            setPublisherName('');
            setPublisherLogo(null);
            setPreviewLogo(null);
            queryClient.invalidateQueries(['publishers']); // Invalidate cache to refetch publishers in other components
        },
        onError: (error) => {
            console.error('Failed to add publisher:', error);
            toast.error(error.response?.data?.message || 'Failed to add publisher.');
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!publisherName || !publisherLogo) {
            toast.error('Please enter publisher name and select a logo.');
            return;
        }

        const formData = new FormData();
        formData.append('name', publisherName);
        formData.append('logo', publisherLogo); // Append the actual file

        addPublisherMutation.mutate(formData);
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Add New Publisher</h1>
            <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-xl max-w-xl mx-auto space-y-6">
                <div>
                    <label htmlFor="publisherName" className="block text-lg font-semibold text-gray-700 mb-2">Publisher Name</label>
                    <input
                        type="text"
                        id="publisherName"
                        className="w-full px-4 py-2 border text-gray-600 border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={publisherName}
                        onChange={(e) => setPublisherName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="publisherLogo" className="block text-lg font-semibold text-gray-700 mb-2">Publisher Logo</label>
                    <input
                        type="file"
                        id="publisherLogo"
                        accept="image/*"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={handleLogoChange}
                        required={!previewLogo}
                    />
                    {previewLogo && (
                        <div className="mt-4">
                            <img src={previewLogo} alt="Logo Preview" className="max-w-[150px] h-auto rounded-md shadow-md" />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold text-lg"
                    disabled={addPublisherMutation.isLoading}
                >
                    {addPublisherMutation.isLoading ? 'Adding Publisher...' : 'Add Publisher'}
                </button>
            </form>
        </div>
    );
};

export default AddPublisher;
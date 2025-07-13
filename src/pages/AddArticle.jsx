import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { addArticle } from '../services/articleApi';
import { fetchAllPublishers } from '../services/publisherApi';
import Select from 'react-select'; // For tags and publisher dropdown
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // SunEditor's default CSS

const AddArticle = () => {
    const { user, loading: authLoading } = useAuth();
    const queryClient = useQueryClient();

    // Form states
    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [selectedPublisher, setSelectedPublisher] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [description, setDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [previewImage, setPreviewImage] = useState(null);

    // Fetch publishers for the dropdown using TanStack Query
    const { data: publishers = [], isLoading: publishersLoading } = useQuery({
        queryKey: ['publishers'],
        queryFn: fetchAllPublishers,
        staleTime: 5 * 60 * 1000,
    });

    // Format publishers data for react-select
    const publisherOptions = publishers.map(p => ({
        value: p.name,
        label: p.name
    }));

    // Static tags for react-select (as per requirements)
    const tagOptions = [
        { value: 'Technology', label: 'Technology' },
        { value: 'Science', label: 'Science' },
        { value: 'Health', label: 'Health' },
        { value: 'Sports', label: 'Sports' },
        { value: 'Politics', label: 'Politics' },
        { value: 'Economy', label: 'Economy' },
        { value: 'Culture', label: 'Culture' },
        { value: 'Travel', label: 'Travel' },
        { value: 'Food', label: 'Food' },
    ];

    // Handles image file selection and creates a preview URL
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setImageFile(null);
            setPreviewImage(null);
        }
    };

    // TanStack Mutation for adding an article
    const addArticleMutation = useMutation({
        mutationFn: addArticle,
        onSuccess: (data) => {
            toast.success(data.message);
            // Clear form fields on successful submission
            setTitle('');
            setImageFile(null);
            setSelectedPublisher(null);
            setSelectedTags([]);
            setDescription('');
            setLongDescription('');
            setPreviewImage(null);
            queryClient.invalidateQueries(['myArticles']); // Invalidate cache to refresh 'My Articles' page
        },
        onError: (error) => {
            console.error('Failed to add article:', error);
            // Display error message from backend or a generic one
            toast.error(error.response?.data?.message || 'Failed to add article. Please try again.');
        },
    });

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic client-side validation
        if (!user) {
            toast.error('You must be logged in to add an article.');
            return;
        }
        if (!title || !imageFile || !selectedPublisher || selectedTags.length === 0 || !description || !longDescription) {
            toast.error('Please fill in all required fields and select an image.');
            return;
        }

        // Create FormData object for file upload and other text fields
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', imageFile);
        formData.append('publisher', selectedPublisher.value);
        formData.append('tags', JSON.stringify(selectedTags.map(tag => tag.value)));
        formData.append('description', description);
        formData.append('longDescription', longDescription);

        // Trigger the mutation
        addArticleMutation.mutate(formData);
    };

    // Show a loader while authentication or publishers data is loading
    if (authLoading || publishersLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="ml-4 text-xl">Loading form data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-white leading-tight">
                    Craft Your Story ✍️
                </h1>
                <p className="text-center text-lg text-gray-300 mb-12">
                    Share your insights and news with the world. Your article awaits admin approval.
                </p>

                <form onSubmit={handleSubmit} className="bg-gray-800 p-8 md:p-10 rounded-xl shadow-2xl space-y-8 border border-gray-700">
                    {/* Article Title */}
                    <div>
                        <label htmlFor="title" className="block text-lg font-semibold text-gray-200 mb-3">Article Title</label>
                        <input
                            type="text"
                            id="title"
                            className="w-full px-5 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            placeholder="Enter a captivating title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Article Image Upload */}
                    <div>
                        <label htmlFor="image" className="block text-lg font-semibold text-gray-200 mb-3">Article Image</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            className="w-full text-base text-gray-300 file:mr-5 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-200 cursor-pointer"
                            onChange={handleImageChange}
                            required={!previewImage} // Required if no image is already selected (for initial submission)
                        />
                        {previewImage && (
                            <div className="mt-6 flex justify-center">
                                <img src={previewImage} alt="Image Preview" className="max-w-xs md:max-w-sm lg:max-w-md h-auto rounded-lg shadow-lg border border-gray-600" />
                            </div>
                        )}
                    </div>

                    {/* Publisher Dropdown */}
                    <div>
                        <label htmlFor="publisher" className="block text-lg font-semibold text-gray-200 mb-3">Publisher</label>
                        <Select
                            id="publisher"
                            options={publisherOptions}
                            value={selectedPublisher}
                            onChange={setSelectedPublisher}
                            placeholder="Select a Publisher"
                            isLoading={publishersLoading}
                            isClearable
                            required
                            className="basic-single text-gray-800" // Apply text-gray-800 to ensure dropdown text is readable
                            classNamePrefix="select"
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    backgroundColor: '#374151', // bg-gray-700
                                    borderColor: '#4b5563',    // border-gray-600
                                    color: '#f9fafb',          // text-white
                                    padding: '6px 0px',        // Adjust padding
                                    boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none', // focus:ring-blue-500
                                    '&:hover': { borderColor: '#60a5fa' }, // hover:border-blue-400
                                }),
                                singleValue: (baseStyles) => ({
                                    ...baseStyles,
                                    color: '#f9fafb', // text-white
                                }),
                                placeholder: (baseStyles) => ({
                                    ...baseStyles,
                                    color: '#9ca3af', // placeholder-gray-400
                                }),
                                menu: (baseStyles) => ({
                                    ...baseStyles,
                                    backgroundColor: '#374151', // bg-gray-700 for dropdown menu
                                }),
                                option: (baseStyles, state) => ({
                                    ...baseStyles,
                                    backgroundColor: state.isSelected ? '#2563eb' : (state.isFocused ? '#4b5563' : '#374151'), // selected: bg-blue-600, focused: bg-gray-600
                                    color: '#f9fafb', // text-white
                                    '&:active': { backgroundColor: '#2563eb' },
                                }),
                                multiValue: (baseStyles) => ({
                                    ...baseStyles,
                                    backgroundColor: '#4b5563', // bg-gray-600 for selected tags
                                }),
                                multiValueLabel: (baseStyles) => ({
                                    ...baseStyles,
                                    color: '#f9fafb', // text-white for selected tag labels
                                }),
                                multiValueRemove: (baseStyles) => ({
                                    ...baseStyles,
                                    color: '#f9fafb', // text-white for remove icon
                                    '&:hover': {
                                        backgroundColor: '#ef4444', // bg-red-500 on hover
                                        color: 'white',
                                    },
                                }),
                            }}
                        />
                    </div>

                    {/* Tags Multi-select */}
                    <div>
                        <label htmlFor="tags" className="block text-lg font-semibold text-gray-200 mb-3">Tags</label>
                        <Select
                            id="tags"
                            options={tagOptions}
                            value={selectedTags}
                            onChange={setSelectedTags}
                            isMulti
                            placeholder="Select relevant tags..."
                            required
                            className="basic-multi-select text-gray-800" // Apply text-gray-800 to ensure dropdown text is readable
                            classNamePrefix="select"
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    backgroundColor: '#374151',
                                    borderColor: '#4b5563',
                                    color: '#f9fafb',
                                    padding: '6px 0px',
                                    boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                                    '&:hover': { borderColor: '#60a5fa' },
                                }),
                                singleValue: (baseStyles) => ({
                                    ...baseStyles,
                                    color: '#f9fafb',
                                }),
                                placeholder: (baseStyles) => ({
                                    ...baseStyles,
                                    color: '#9ca3af',
                                }),
                                menu: (baseStyles) => ({
                                    ...baseStyles,
                                    backgroundColor: '#374151',
                                }),
                                option: (baseStyles, state) => ({
                                    ...baseStyles,
                                    backgroundColor: state.isSelected ? '#2563eb' : (state.isFocused ? '#4b5563' : '#374151'),
                                    color: '#f9fafb',
                                    '&:active': { backgroundColor: '#2563eb' },
                                }),
                                multiValue: (baseStyles) => ({
                                    ...baseStyles,
                                    backgroundColor: '#4b5563',
                                }),
                                multiValueLabel: (baseStyles) => ({
                                    ...baseStyles,
                                    color: '#f9fafb',
                                }),
                                multiValueRemove: (baseStyles) => ({
                                    ...baseStyles,
                                    color: '#f9fafb',
                                    '&:hover': {
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                    },
                                }),
                            }}
                        />
                    </div>

                    {/* Short Description */}
                    <div>
                        <label htmlFor="description" className="block text-lg font-semibold text-gray-200 mb-3">Short Description</label>
                        <textarea
                            id="description"
                            rows="3"
                            className="w-full px-5 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
                            placeholder="Provide a brief summary for your article's card view..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    {/* Long Description (Article Content) - SunEditor */}
                    <div>
                        <label htmlFor="longDescription" className="block text-lg font-semibold text-gray-200 mb-3">Long Description (Article Content)</label>
                        <SunEditor
                            setContents={longDescription}
                            onChange={setLongDescription}
                            setOptions={{
                                height: 350, // Increased height for better editing experience
                                buttonList: [
                                    ['undo', 'redo'],
                                    ['font', 'fontSize', 'formatBlock'],
                                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                                    ['fontColor', 'hiliteColor'],
                                    ['align', 'list', 'blockquote'],
                                    ['link', 'image', 'video'], // Added video for richness
                                    ['codeView', 'fullScreen'],
                                    ['removeFormat']
                                ],
                                // Attempt to style SunEditor for dark theme (might need more specific overrides in global CSS)
                                colorList: [ // Custom color list for dark theme compatibility
                                    ['#000', '#fff', '#dc2626', '#16a34a', '#2563eb', '#6d28d9', '#db2777'],
                                ],
                                paragraphStyles: [ // Custom paragraph styles if needed
                                    'blockquote', 'code', 'highlight', 'note'
                                ]
                            }}
                            // You might need to add a custom class here and override SunEditor's default CSS in your global.css
                            // Example: `className="suneditor-dark-theme"`
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-8 rounded-lg font-bold text-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                        disabled={addArticleMutation.isLoading || authLoading || publishersLoading}
                    >
                        {addArticleMutation.isLoading ? 'Publishing...' : 'Submit Article for Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddArticle;
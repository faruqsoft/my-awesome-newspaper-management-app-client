import React, { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { addArticle } from '../services/articleApi';
import { fetchAllPublishers } from '../services/publisherApi'; // You'll create this later
import Select from 'react-select'; // For tags
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';


const AddArticle = () => {
    const { user, loading: authLoading } = useAuth();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [selectedPublisher, setSelectedPublisher] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [description, setDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [previewImage, setPreviewImage] = useState(null);

    // Fetch publishers for the dropdown
    const { data: publishers = [], isLoading: publishersLoading } = useQuery({
        queryKey: ['publishers'],
        queryFn: fetchAllPublishers, // This function needs to be created in publisherApi.js
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    });

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file)); // Create a URL for image preview
        } else {
            setImageFile(null);
            setPreviewImage(null);
        }
    };

    const addArticleMutation = useMutation({
        mutationFn: addArticle,
        onSuccess: (data) => {
            toast.success(data.message);
            // Optionally clear form or navigate
            setTitle('');
            setImageFile(null);
            setSelectedPublisher(null);
            setSelectedTags([]);
            setDescription('');
            setLongDescription('');
            setPreviewImage(null);
            queryClient.invalidateQueries(['myArticles']); // Invalidate cache for my articles
        },
        onError: (error) => {
            console.error('Failed to add article:', error);
            toast.error(error.response?.data?.message || 'Failed to add article.');
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('You must be logged in to add an article.');
            return;
        }
        if (!title || !imageFile || !selectedPublisher || selectedTags.length === 0 || !description || !longDescription) {
            toast.error('Please fill in all required fields, including selecting an image.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', imageFile); // Append the actual file
        formData.append('publisher', selectedPublisher.value);
        formData.append('tags', JSON.stringify(selectedTags.map(tag => tag.value))); // Send tags as JSON string
        formData.append('description', description);
        formData.append('longDescription', longDescription);

        addArticleMutation.mutate(formData);
    };

    if (authLoading || publishersLoading) {
        return <div className="text-center p-8">Loading...</div>; // Simple loader
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-300">Add New Article</h1>
            <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-xl max-w-3xl mx-auto space-y-6">
                <div>
                    <label htmlFor="title" className="block text-lg font-semibold text-gray-300 mb-2">Article Title</label>
                    <input
                        type="text"
                        id="title"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="image" className="block text-lg font-semibold text-gray-300 mb-2">Article Image</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={handleImageChange}
                        required={!previewImage} // Required if no image is already selected
                    />
                    {previewImage && (
                        <div className="mt-4">
                            <img src={previewImage} alt="Image Preview" className="max-w-xs h-auto rounded-md shadow-md" />
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="publisher" className="block text-lg font-semibold text-gray-300 mb-2">Publisher</label>
                    <Select
                        id="publisher"
                        options={publisherOptions}
                        value={selectedPublisher}
                        onChange={setSelectedPublisher}
                        placeholder="Select a Publisher"
                        isLoading={publishersLoading}
                        isClearable
                        required
                        className="basic-single"
                        classNamePrefix="select"
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-lg font-semibold text-gray-300 mb-2">Tags</label>
                    <Select
                        id="tags"
                        options={tagOptions}
                        value={selectedTags}
                        onChange={setSelectedTags}
                        isMulti
                        placeholder="Select Tags"
                        required
                        className="basic-multi-select text-gray-800"
                        classNamePrefix="select"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-lg font-semibold text-gray-300 mb-2">Short Description</label>
                    <textarea
                        id="description"
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="longDescription" className="block text-lg font-semibold text-gray-300 mb-2">Long Description (Article Content)</label>
                    {/* You can replace this with SunEditor or another rich text editor */}
                    <SunEditor
                        setContents={longDescription}
                        onChange={setLongDescription}
                        setOptions={{
                            height: 300,
                            buttonList: [
                                ['undo', 'redo'],
                                ['bold', 'underline', 'italic', 'strike'],
                                ['font', 'fontSize', 'formatBlock'],
                                ['paragraphStyle', 'blockquote'],
                                ['fontColor', 'lineHeight'],
                                ['align', 'list', 'outdent', 'indent'],
                                ['link', 'image'],
                                ['fullScreen', 'showBlocks', 'codeView'],
                            ],
                        }}
                    />
                    {/* Or simply use a textarea if you prefer */}
                    {/* <textarea
                        id="longDescription"
                        rows="10"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={longDescription}
                        onChange={(e) => setLongDescription(e.target.value)}
                        required
                    ></textarea> */}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold text-lg"
                    disabled={addArticleMutation.isLoading || authLoading || publishersLoading}
                >
                    {addArticleMutation.isLoading ? 'Adding Article...' : 'Submit Article'}
                </button>
            </form>
        </div>
    );
};

export default AddArticle;
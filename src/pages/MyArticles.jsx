import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyArticles, deleteMyArticle, updateMyArticle } from '../services/articleApi';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SunEditor from 'suneditor-react'; // For rich text editor in update modal
import Select from 'react-select'; // For tags in update modal
import { fetchAllPublishers } from '../services/publisherApi'; // For publisher dropdown in update modal
import Swal from 'sweetalert2'; // For elegant confirmation/decline reason modal

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

const MyArticles = () => {
    const queryClient = useQueryClient();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(null);

    // Form states for update
    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [selectedPublisher, setSelectedPublisher] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [description, setDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [previewImage, setPreviewImage] = useState(null); // For new image preview

    const { data: myArticles = [], isLoading, isError, error } = useQuery({
        queryKey: ['myArticles'],
        queryFn: fetchMyArticles,
        staleTime: 60 * 1000, // 1 minute
    });

    const { data: publishers = [], isLoading: publishersLoading } = useQuery({
        queryKey: ['publishers'],
        queryFn: fetchAllPublishers,
        staleTime: 5 * 60 * 1000,
    });

    const publisherOptions = publishers.map(p => ({
        value: p.name,
        label: p.name
    }));


    const deleteMutation = useMutation({
        mutationFn: deleteMyArticle,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(['myArticles']); // Refresh my articles list
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to delete article.');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, formData }) => updateMyArticle(id, formData),
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(['myArticles']);
            setIsUpdateModalOpen(false); // Close modal on success
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update article.');
        },
    });

    const handleDelete = (articleId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(articleId);
            }
        });
    };

    const handleUpdateClick = (article) => {
        setCurrentArticle(article);
        setTitle(article.title);
        setImageFile(null); // Clear file input
        setPreviewImage(article.image); // Set current image as preview
        setSelectedPublisher(publisherOptions.find(p => p.value === article.publisher) || null);
        setSelectedTags(tagOptions.filter(tag => article.tags.includes(tag.value)));
        setDescription(article.description);
        setLongDescription(article.longDescription);
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        if (!currentArticle) return;

        const formData = new FormData();
        formData.append('title', title);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        if (selectedPublisher) {
            formData.append('publisher', selectedPublisher.value);
        }
        formData.append('tags', JSON.stringify(selectedTags.map(tag => tag.value)));
        formData.append('description', description);
        formData.append('longDescription', longDescription);

        updateMutation.mutate({ id: currentArticle._id, formData });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setImageFile(null);
            setPreviewImage(currentArticle?.image || null); // Revert to old image if cleared
        }
    };

    const showDeclineReason = (reason) => {
        Swal.fire({
            title: 'Decline Reason',
            text: reason,
            icon: 'info',
            confirmButtonText: 'Got It'
        });
    };

    if (isLoading || publishersLoading) {
        return <div className="text-center p-8">Loading your articles...</div>;
    }

    if (isError) {
        return <div className="text-center p-8 text-red-600">Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">My Articles</h1>

            {myArticles.length === 0 ? (
                <p className="text-center text-gray-600 text-xl">You haven't posted any articles yet.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-xl p-4">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Serial No.
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Article Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Is Premium
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {myArticles.map((article, index) => (
                                <tr key={article._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {article.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            article.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            article.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {article.status}
                                        </span>
                                        {article.status === 'declined' && (
                                            <button
                                                onClick={() => showDeclineReason(article.declineReason)}
                                                className="ml-2 text-blue-600 hover:text-blue-900 text-xs font-semibold"
                                                title="View Decline Reason"
                                            >
                                                (Reason)
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {article.isPremium ? 'Yes' : 'No'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link to={`/articles/${article._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                                            Details
                                        </Link>
                                        {article.status !== 'approved' && ( // Can only update if not approved
                                            <button
                                                onClick={() => handleUpdateClick(article)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Update
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(article._id)}
                                            className="text-red-600 hover:text-red-900"
                                            disabled={deleteMutation.isLoading}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Update Article Modal */}
            {isUpdateModalOpen && currentArticle && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Update Article: {currentArticle.title}</h2>
                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="updateTitle" className="block text-lg font-semibold text-gray-700 mb-2">Article Title</label>
                                <input
                                    type="text"
                                    id="updateTitle"
                                    className="w-full px-4 py-2 bg-gray-600 text-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="updateImage" className="block text-lg font-semibold text-gray-700 mb-2">Article Image</label>
                                <input
                                    type="file"
                                    id="updateImage"
                                    accept="image/*"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={handleImageChange}
                                />
                                {previewImage && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600 mb-2">Current/New Image Preview:</p>
                                        <img src={previewImage} alt="Image Preview" className="max-w-xs h-auto rounded-md shadow-md" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="updatePublisher" className="block text-lg font-semibold text-gray-700 mb-2">Publisher</label>
                                <Select
                                    id="updatePublisher"
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
                                <label htmlFor="updateTags" className="block text-lg font-semibold text-gray-700 mb-2">Tags</label>
                                <Select
                                    id="updateTags"
                                    options={tagOptions}
                                    value={selectedTags}
                                    onChange={setSelectedTags}
                                    isMulti
                                    placeholder="Select Tags"
                                    required
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                      styles={{
                                control: (baseStyles) => ({
                                    ...baseStyles,
                                    backgroundColor: '#9ca3af', // gray-400 equivalent for base (this is gray-500)
                                    borderColor: '#6b7280', // gray-500 equivalent for border
                                    color: '#1f2937', // gray-900 equivalent for text
                                }),
                                singleValue: (baseStyles) => ({ ...baseStyles, color: '#1f2937' }),
                                placeholder: (baseStyles) => ({ ...baseStyles, color: '#4b5563' }),
                                menu: (baseStyles) => ({ ...baseStyles, backgroundColor: '#f3f4f6' }),
                                option: (baseStyles, state) => ({
                                    ...baseStyles,
                                    backgroundColor: state.isSelected ? '#2563eb' : (state.isFocused ? '#e5e7eb' : '#f9fafb'),
                                    color: state.isSelected ? '#fff' : '#1f2937',
                                }),
                                multiValue: (baseStyles) => ({ ...baseStyles, backgroundColor: '#bfdbfe' }),
                                multiValueLabel: (baseStyles) => ({ ...baseStyles, color: '#1e40af' }),
                                multiValueRemove: (baseStyles) => ({
                                    ...baseStyles,
                                    color: '#1e40af',
                                    '&:hover': { backgroundColor: '#ef4444', color: 'white' },
                                }),
                            }}
                                />
                            </div>

                            <div>
                                <label htmlFor="updateDescription" className="block text-lg font-semibold text-gray-700 mb-2">Short Description</label>
                                <textarea
                                    id="updateDescription"
                                    rows="3"
                                    className="w-full px-4 py-2 border bg-gray-200 text-gray-800 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label htmlFor="updateLongDescription" className="block text-lg font-semibold text-gray-700 mb-2">Long Description (Article Content)</label>
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
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsUpdateModalOpen(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
                                    disabled={updateMutation.isLoading}
                                >
                                    {updateMutation.isLoading ? 'Updating...' : 'Update Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyArticles;
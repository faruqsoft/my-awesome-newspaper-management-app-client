import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchAllArticlesAdmin,
    approveArticle,
    declineArticle,
    makeArticlePremium,
    deleteMyArticle // Re-using deleteMyArticle as it only needs article ID
} from '../../services/articleApi';
import { fetchAllPublishers } from '../../services/publisherApi';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2'; // For elegant confirmation/input modal

const AllArticlesAdmin = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPublisher, setFilterPublisher] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10; // Articles per page

    const { data: publishers = [] } = useQuery({
        queryKey: ['publishers'],
        queryFn: fetchAllPublishers,
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: articlesData = { articles: [], totalPages: 0, currentPage: 1, totalResults: 0 },
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['adminArticles', searchQuery, filterStatus, filterPublisher, page, limit],
        queryFn: () => fetchAllArticlesAdmin({
            search: searchQuery,
            status: filterStatus,
            publisher: filterPublisher,
            page,
            limit
        }),
        staleTime: 30 * 1000, // 30 seconds
    });

    const approveMutation = useMutation({
        mutationFn: approveArticle,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(['adminArticles']);
            queryClient.invalidateQueries(['approvedArticles']); // Also refresh public articles
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to approve article.');
        },
    });

    const declineMutation = useMutation({
        mutationFn: ({ id, reason }) => declineArticle(id, reason),
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(['adminArticles']);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to decline article.');
        },
    });

    const makePremiumMutation = useMutation({
        mutationFn: makeArticlePremium,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(['adminArticles']);
            queryClient.invalidateQueries(['premiumArticles']); // Refresh premium articles list
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to make article premium.');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteMyArticle, // Re-using this from user's side
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(['adminArticles']);
            queryClient.invalidateQueries(['approvedArticles']); // Also refresh public articles
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to delete article.');
        },
    });


    const handleDeclineClick = (articleId) => {
        Swal.fire({
            title: 'Decline Article',
            input: 'textarea',
            inputLabel: 'Reason for declining:',
            inputPlaceholder: 'Enter reason here...',
            inputAttributes: {
                'aria-label': 'Enter reason here'
            },
            showCancelButton: true,
            confirmButtonText: 'Decline',
            confirmButtonColor: '#d33',
            showLoaderOnConfirm: true,
            preConfirm: (reason) => {
                if (!reason) {
                    Swal.showValidationMessage('Reason is required.');
                }
                return { id: articleId, reason: reason };
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                declineMutation.mutate(result.value);
            }
        });
    };

    const handleDeleteClick = (articleId) => {
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

    if (isLoading) {
        return <div className="text-center p-8">Loading all articles for admin...</div>;
    }

    if (isError) {
        return <div className="text-center p-8 text-red-600">Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Manage All Articles</h1>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search by title..."
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                />
                <select
                    className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                >
                    <option value="">Filter by Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                </select>
                <select
                    className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={filterPublisher}
                    onChange={(e) => { setFilterPublisher(e.target.value); setPage(1); }}
                >
                    <option value="">Filter by Publisher</option>
                    {publishers.map(p => (
                        <option key={p._id} value={p.name}>{p.name}</option>
                    ))}
                </select>
            </div>

            {articlesData.articles.length === 0 ? (
                <p className="text-center text-gray-600 text-xl">No articles found matching your criteria.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-xl p-4">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Author
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Posted Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Publisher
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Premium
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {articlesData.articles.map((article) => (
                                <tr key={article._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">
                                        {article.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <img src={article.authorPhoto} alt={article.authorName} className="w-8 h-8 rounded-full mr-2" />
                                            <div>
                                                <div className="font-medium">{article.authorName}</div>
                                                <div className="text-gray-500">{article.authorEmail}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(article.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <img src={article.publisherLogo} alt={article.publisher} className="w-6 h-6 rounded-full mr-2" />
                                            {article.publisher}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            article.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            article.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {article.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {article.isPremium ? 'Yes' : 'No'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {article.status !== 'approved' && (
                                            <button
                                                onClick={() => approveMutation.mutate(article._id)}
                                                className="text-green-600 hover:text-green-900 mr-4"
                                                disabled={approveMutation.isLoading}
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {article.status !== 'declined' && (
                                            <button
                                                onClick={() => handleDeclineClick(article._id)}
                                                className="text-red-600 hover:text-red-900 mr-4"
                                                disabled={declineMutation.isLoading}
                                            >
                                                Decline
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteMutation.mutate(article._id)}
                                            className="text-gray-600 hover:text-gray-900 mr-4"
                                            disabled={deleteMutation.isLoading}
                                        >
                                            Delete
                                        </button>
                                        {!article.isPremium && article.status === 'approved' && ( // Only approved articles can be made premium
                                            <button
                                                onClick={() => makePremiumMutation.mutate(article._id)}
                                                className="text-yellow-600 hover:text-yellow-900"
                                                disabled={makePremiumMutation.isLoading}
                                            >
                                                Make Premium
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {articlesData.totalPages > 1 && (
                        <div className="flex justify-center mt-6 space-x-2">
                            <button
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {[...Array(articlesData.totalPages).keys()].map(pNum => (
                                <button
                                    key={pNum + 1}
                                    onClick={() => setPage(pNum + 1)}
                                    className={`px-4 py-2 border rounded-md ${
                                        page === pNum + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    {pNum + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(prev => Math.min(prev + 1, articlesData.totalPages))}
                                disabled={page === articlesData.totalPages}
                                className="px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AllArticlesAdmin;
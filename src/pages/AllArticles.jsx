import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApprovedArticles } from '../services/articleApi';
import { fetchAllPublishers } from '../services/publisherApi'; // Needed for publisher filter
import { Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider'; // To check premium status
import Loader from '../components/shared/Loader';

const tagOptions = [ // Same as in AddArticle.jsx
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

const AllArticles = () => {
    const { user, isPremium: isUserPremium, loading: authLoading } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPublisherFilter, setSelectedPublisherFilter] = useState('');
    const [selectedTagsFilter, setSelectedTagsFilter] = useState(''); // Comma-separated string for simplicity

    const { data: publishers = [] } = useQuery({
        queryKey: ['publishers'],
        queryFn: fetchAllPublishers,
        staleTime: 5 * 60 * 1000,
    });

    const { data: articles = [], isLoading, isError, error } = useQuery({
        queryKey: ['approvedArticles', searchQuery, selectedPublisherFilter, selectedTagsFilter],
        queryFn: () => fetchApprovedArticles({
            search: searchQuery,
            publisher: selectedPublisherFilter,
            tags: selectedTagsFilter,
        }),
        staleTime: 1 * 60 * 1000, // 1 minute cache for dynamic data
    });

    if (isLoading || authLoading) {
        return <Loader />;
    }

    if (isError) {
        return <div className="text-center p-8 text-red-600">Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-300">All Articles</h1>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search by title..."
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    className="w-full md:w-1/4 px-4 py-2 border bg-gray-700 text-white border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={selectedPublisherFilter}
                    onChange={(e) => setSelectedPublisherFilter(e.target.value)}
                >
                    <option value="">Filter by Publisher</option>
                    {publishers.map(p => (
                        <option key={p._id} value={p.name}>{p.name}</option>
                    ))}
                </select>
                <select
                    className="w-full md:w-1/4 px-4 py-2 bg-gray-700 text-white border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={selectedTagsFilter}
                    onChange={(e) => setSelectedTagsFilter(e.target.value)}
                >
                    <option value="">Filter by Tag</option>
                    {tagOptions.map(tag => (
                        <option key={tag.value} value={tag.value}>{tag.label}</option>
                    ))}
                </select>
            </div>

            {articles.length === 0 ? (
                <p className="text-center text-gray-300 text-xl">No articles found matching your criteria.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => {
                        const isPremiumArticle = article.isPremium;
                        const isDetailsButtonDisabled = isPremiumArticle && (!user || !isUserPremium);

                        return (
                            <div
                                key={article._id}
                                className={`rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl bg-gray-800 ${
                                    isPremiumArticle ? 'shadow-[0_8px_30px_rgb(249,115,22,0.1)]' : 'shadow-[0_8px_30px_rgba(0,0,0,0.1)]'
                                }`}
                            >
                                {isPremiumArticle && (
                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        PREMIUM
                                    </div>
                                )}
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-5">
                                    <h2 className="text-xl font-semibold text-gray-100 mb-2 truncate">{article.title}</h2>
                                    <div className="flex items-center text-sm text-gray-100 mb-3">
                                        <img src={article.publisherLogo} alt={article.publisher} className="w-6 h-6 rounded-full mr-2" />
                                        <span>{article.publisher}</span>
                                    </div>
                                    <p className="text-gray-100 text-sm mb-4 line-clamp-3">{article.description}</p>
                                    <Link to={`/articles/${article._id}`}>
                                        <button
                                            className={`w-full py-2 px-4 rounded-md font-semibold ${
                                                isDetailsButtonDisabled
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                            disabled={isDetailsButtonDisabled}
                                        >
                                            {isPremiumArticle && !user
                                                ? 'Login to view Premium'
                                                : isPremiumArticle && !isUserPremium
                                                ? 'Subscribe to view Premium'
                                                : 'View Details'}
                                        </button>
                                    </Link>
                                    {isPremiumArticle && !isDetailsButtonDisabled && (
                                        <p className="text-xs text-center text-yellow-600 mt-2">
                                            This is a premium article.
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AllArticles;
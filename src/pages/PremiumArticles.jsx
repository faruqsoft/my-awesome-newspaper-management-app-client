import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPremiumArticles } from '../services/articleApi';
import { useAuth } from '../providers/AuthProvider';
import { Link } from 'react-router-dom';

const PremiumArticles = () => {
    const { user, isPremium: isUserPremium, loading: authLoading } = useAuth();

    // Query will only run if user is logged in and is a premium user
    const { data: premiumArticles = [], isLoading, isError, error } = useQuery({
        queryKey: ['premiumArticles'],
        queryFn: fetchPremiumArticles,
        enabled: !authLoading && user && isUserPremium, // Only enable if user is logged in and premium
        staleTime: 60 * 1000, // 1 minute
    });

    if (authLoading) {
        return <div className="text-center p-8">Checking premium status...</div>;
    }

    if (!user || !isUserPremium) {
        return (
            <div className="container mx-auto p-8 text-center bg-white shadow-lg rounded-lg mt-10">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-lg text-gray-700 mb-6">You must be a premium user to view these articles.</p>
                <Link to="/subscription" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-md transition duration-300 text-lg">
                    Get Premium Access
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return <div className="text-center p-8">Loading Premium Articles...</div>;
    }

    if (isError) {
        return <div className="text-center p-8 text-red-600">Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Exclusive Premium Articles</h1>

            {premiumArticles.length === 0 ? (
                <p className="text-center text-gray-600 text-xl">No premium articles available at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {premiumArticles.map((article) => (
                        <div key={article._id} className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-purple-500 transform hover:scale-105 transition-transform">
                             <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                PREMIUM
                            </div>
                            <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                            <div className="p-5">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">{article.title}</h2>
                                <div className="flex items-center text-sm text-gray-600 mb-3">
                                    <img src={article.publisherLogo} alt={article.publisher} className="w-6 h-6 rounded-full mr-2" />
                                    <span>{article.publisher}</span>
                                </div>
                                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{article.description}</p>
                                <Link to={`/articles/${article._id}`}>
                                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md">
                                        View Details
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PremiumArticles;
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPremiumArticles } from '../services/articleApi';
import { useAuth } from '../providers/AuthProvider';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // For notifications

const PremiumArticles = () => {
    const { user, isPremium: isUserPremium, loading: authLoading } = useAuth();

    // Query will only run if user is logged in and is a premium user
    // `enabled` option ensures this API call is conditional
    const { data: premiumArticles = [], isLoading, isError, error } = useQuery({
        queryKey: ['premiumArticles'],
        queryFn: fetchPremiumArticles,
        // Query is enabled only if authentication is not loading AND user exists AND user is premium
        enabled: !authLoading && user && isUserPremium,
        staleTime: 60 * 1000, // Data considered fresh for 1 minute
        onError: (err) => {
            console.error('Error fetching premium articles:', err);
            toast.error(err.response?.data?.message || 'Failed to load premium articles.');
        }
    });

    // --- Loading State for Authentication or Articles Fetch ---
    if (authLoading || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-800">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="ml-4 text-xl">Checking premium status and loading articles...</p>
            </div>
        );
    }

    // --- Access Denied State (User not logged in or not premium) ---
    // This condition applies if:
    // 1. user is null (not logged in)
    // 2. user exists but isUserPremium is false (logged in but not subscribed)
    if (!user || !isUserPremium) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-2xl border border-red-300 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-6 leading-tight">
                        Access Denied! 🚫
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-md mx-auto">
                        This content is exclusive to our premium subscribers.
                        Unlock all premium articles and an ad-free experience.
                    </p>
                    <Link to="/subscription">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 text-lg md:text-xl">
                            Get Premium Access Now!
                        </button>
                    </Link>
                    {!user && ( // Show login prompt only if not logged in
                        <p className="mt-6 text-gray-600 text-sm md:text-base">
                            Already a premium member? <Link to="/login" className="text-blue-600 hover:underline font-semibold">Log in here</Link>.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // --- Error Fetching Articles (after premium check passes) ---
    if (isError) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-red-600 text-xl p-6 text-center">
                <p className="mb-4">Failed to load premium articles.</p>
                <p className="text-lg">Error: {error.message}</p>
                <Link to="/" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Go to Homepage
                </Link>
            </div>
        );
    }

    // --- Display Premium Articles ---
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-gray-800 leading-tight">
                    Exclusive Premium Articles ✨
                </h1>
                <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                    Welcome, Premium Member! Dive into our curated collection of exclusive articles, crafted just for you.
                </p>

                {premiumArticles.length === 0 ? (
                    <p className="text-center text-gray-600 text-xl py-10">No premium articles available at the moment. Check back soon!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {premiumArticles.map((article) => (
                            <div
                                key={article._id}
                                className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-102 hover:shadow-xl duration-300 border border-blue-500 ring-2 ring-blue-200 flex flex-col h-full"
                            >
                                {/* Premium Badge */}
                                <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">
                                    PREMIUM
                                </div>
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-56 object-cover object-center"
                                />
                                <div className="p-6 flex flex-col flex-grow">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight line-clamp-2">{article.title}</h2>
                                    <div className="flex items-center text-sm text-gray-500 mb-3">
                                        {article.publisherLogo && (
                                            <img src={article.publisherLogo} alt={article.publisher} className="w-5 h-5 rounded-full mr-2 object-contain" />
                                        )}
                                        <span className="font-medium">{article.publisher}</span>
                                        <span className="mx-2">•</span>
                                        <span className="text-xs">{new Date(article.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-700 text-base mb-5 line-clamp-3 flex-grow">{article.description}</p>
                                    <Link to={`/articles/${article._id}`} className="block mt-auto">
                                        <button className="w-full py-3 px-4 rounded-lg text-white font-semibold text-lg bg-blue-600 hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PremiumArticles;
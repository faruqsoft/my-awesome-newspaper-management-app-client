import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link for subscription button
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Removed useMutation as view count handled by GET
import { fetchArticleDetails } from '../services/articleApi';
import { useAuth } from '../providers/AuthProvider';
import { toast } from 'react-hot-toast';
import DOMPurify from 'dompurify'; // For safely rendering HTML content from SunEditor

const ArticleDetails = () => {
    const { id } = useParams(); // Get article ID from URL
    const navigate = useNavigate();
    const { user, isPremium: isUserPremium, loading: authLoading } = useAuth();
    const queryClient = useQueryClient(); // Used for potential cache invalidation, though not strictly needed for this page

    const { data: article, isLoading, isError, error } = useQuery({
        queryKey: ['articleDetails', id],
        queryFn: () => fetchArticleDetails(id),
        enabled: !!id, // Only run query if id is available
        onSuccess: (data) => {
            // Check premium status and redirect if unauthorized
            if (data.isPremium && !authLoading && (!user || !isUserPremium)) {
                toast.error('This is a premium article. Please subscribe or log in as a premium user to view its content.');
                // Redirect to the All Articles page (or home) instead of staying on a restricted details page.
                navigate('/articles');
            }
        },
        onError: (err) => {
            console.error('Error fetching article details:', err);
            toast.error(err.response?.data?.message || 'Failed to load article details. It might not exist or access is restricted.');
            navigate('/articles'); // Redirect to articles list if there's an error
        },
        staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes, but backend increments on each visit
        gcTime: 10 * 60 * 1000, // Garbage collect after 10 minutes
    });

    // Unified loading state
    if (isLoading || authLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-800">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="ml-4 text-xl">Loading article details...</p>
            </div>
        );
    }

    // Unified error state (after loading) or if article is not found
    if (isError || !article) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-red-600 text-xl p-6 text-center">
                <p className="mb-4">Article not found or an error occurred.</p>
                <p className="text-lg">Error: {(error && error.message) || 'Article could not be loaded.'}</p>
                <Link to="/articles" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Back to All Articles
                </Link>
            </div>
        );
    }

    // Determine if content can be viewed based on premium status
    const isPremiumArticle = article.isPremium;
    const canViewContent = !isPremiumArticle || (user && isUserPremium);

    // Sanitize HTML from SunEditor before rendering
    const sanitizedLongDescription = DOMPurify.sanitize(article.longDescription);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="max-w-5xl w-full bg-white p-8 md:p-10 rounded-xl shadow-2xl border border-gray-200">
                {isPremiumArticle && (
                    <div className="mb-8 text-center text-blue-700 font-bold text-2xl bg-blue-50 py-3 rounded-lg border border-blue-200 shadow-sm">
                        ⭐ PREMIUM ARTICLE ⭐
                    </div>
                )}
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 text-center leading-tight">
                    {article.title}
                </h1>
                <div className="flex flex-col sm:flex-row items-center justify-center mb-8 space-y-3 sm:space-y-0 sm:space-x-6 text-gray-600 text-sm md:text-base">
                    <div className="flex items-center">
                        <img src={article.publisherLogo} alt={article.publisher} className="w-7 h-7 rounded-full mr-2 border border-gray-200 object-contain" />
                        <span className="font-semibold text-gray-700">{article.publisher}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center">
                        <span className="text-gray-700">By {article.authorName}</span>
                    </div>
                    <span>•</span>
                    <span className="text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="text-gray-500">Views: {article.viewCount}</span>
                </div>
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-80 md:h-96 object-cover object-center rounded-lg mb-10 shadow-md border border-gray-200"
                />

                <div className="flex flex-wrap gap-3 mb-10 justify-center">
                    {article.tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className="text-gray-800 text-base md:text-lg leading-relaxed article-content prose prose-blue max-w-none">
                    {canViewContent ? (
                        // Render sanitized HTML content
                        <div dangerouslySetInnerHTML={{ __html: sanitizedLongDescription }} />
                    ) : (
                        <div className="text-center bg-gray-100 p-8 rounded-lg border-2 border-dashed border-gray-300 shadow-inner flex flex-col items-center">
                            <p className="text-2xl font-bold mb-4 text-gray-800">
                                This Content is Exclusively for Premium Subscribers
                            </p>
                            <p className="mb-6 text-gray-700 text-lg">
                                Unlock full access to all premium articles, ad-free Browse, and much more by subscribing today!
                            </p>
                            <Link to="/subscription" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105">
                                Get Premium Access Now!
                            </Link>
                            {!user && (
                                <p className="mt-4 text-gray-600 text-sm">Already a premium member? <Link to="/login" className="text-blue-600 hover:underline">Log in here</Link>.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleDetails;
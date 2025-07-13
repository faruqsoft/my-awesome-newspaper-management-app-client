import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchArticleDetails } from '../services/articleApi';
import { useAuth } from '../providers/AuthProvider';
import { toast } from 'react-hot-toast';

const ArticleDetails = () => {
    const { id } = useParams(); // Get article ID from URL
    const navigate = useNavigate();
    const { user, isPremium: isUserPremium, loading: authLoading } = useAuth();
    const queryClient = useQueryClient();

    const { data: article, isLoading, isError, error } = useQuery({
        queryKey: ['articleDetails', id],
        queryFn: () => fetchArticleDetails(id),
        enabled: !!id, // Only run query if id is available
        onSuccess: (data) => {
            // Check premium status if user is logged in
            if (data.isPremium && !authLoading && (!user || !isUserPremium)) {
                toast.error('This is a premium article. Please subscribe or log in as a premium user to view its content.');
                navigate('/articles'); // Redirect if unauthorized for premium content
            }
        },
        onError: (err) => {
            console.error('Error fetching article details:', err);
            toast.error(err.response?.data?.message || 'Failed to load article details.');
            navigate('/articles'); // Redirect if article not found or other error
        }
    });

    // We don't need a separate mutation for view count if handled by GET request.
    // The current backend `getArticleDetails` already increments `viewCount`.

    if (isLoading || authLoading) {
        return <div className="text-center p-8">Loading Article Details...</div>;
    }

    if (isError || !article) {
        return <div className="text-center p-8 text-red-600">Article not found or access denied.</div>;
    }

    // Check again here to be safe and ensure UI updates
    const isPremiumArticle = article.isPremium;
    const canViewContent = !isPremiumArticle || (user && isUserPremium);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto">
                {isPremiumArticle && (
                    <div className="mb-4 text-center text-yellow-600 font-bold text-lg">
                        ⭐ PREMIUM ARTICLE ⭐
                    </div>
                )}
                <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">{article.title}</h1>
                <div className="flex items-center justify-center mb-6 space-x-4 text-gray-600">
                    <img src={article.publisherLogo} alt={article.publisher} className="w-8 h-8 rounded-full" />
                    <span className="font-semibold">{article.publisher}</span>
                    <span>•</span>
                    <span>By {article.authorName}</span>
                    <span>•</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Views: {article.viewCount}</span>
                </div>
                <img src={article.image} alt={article.title} className="w-full h-96 object-cover rounded-lg mb-8 shadow-md" />

                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {article.tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className="text-gray-800 text-lg leading-relaxed article-content">
                    {canViewContent ? (
                        <div dangerouslySetInnerHTML={{ __html: article.longDescription }} />
                    ) : (
                        <div className="text-center bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300">
                            <p className="text-xl font-semibold mb-4 text-gray-700">
                                This content is for premium subscribers only.
                            </p>
                            <p className="mb-4 text-gray-600">
                                Please login or subscribe to a premium plan to view the full article.
                            </p>
                            <Link to="/subscription" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-md transition duration-300">
                                Get Premium Access
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleDetails;
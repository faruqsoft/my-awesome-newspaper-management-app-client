import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Public Article Calls (using TanStack Query for GETs) ---

export const fetchApprovedArticles = async (searchParams) => {
    // searchParams could contain { search, publisher, tags }
    const params = new URLSearchParams(searchParams).toString();
    const response = await axios.get(`${API_BASE_URL}/articles/approved?${params}`);
    return response.data.articles;
};

export const fetchArticleDetails = async (articleId) => {
    const response = await axios.get(`${API_BASE_URL}/articles/${articleId}`, { headers: getAuthHeaders() });
    return response.data.article;
};

export const fetchTrendingArticles = async () => {
    const response = await axios.get(`${API_BASE_URL}/articles/trending`);
    return response.data.articles;
};

// --- Private Article Calls ---

export const addArticle = async (articleData) => {
    // articleData should be FormData for file upload
    const response = await axios.post(`${API_BASE_URL}/articles/add`, articleData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data' // Important for file uploads
        }
    });
    return response.data;
};

export const fetchMyArticles = async () => {
    const response = await axios.get(`${API_BASE_URL}/articles/my-articles`, { headers: getAuthHeaders() });
    return response.data.articles;
};

export const updateMyArticle = async (articleId, articleData) => {
    // articleData can be FormData if image is updated
    const response = await axios.put(`${API_BASE_URL}/articles/my-articles/${articleId}`, articleData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data' // Important for file uploads
        }
    });
    return response.data;
};

export const deleteMyArticle = async (articleId) => {
    const response = await axios.delete(`${API_BASE_URL}/articles/my-articles/${articleId}`, { headers: getAuthHeaders() });
    return response.data;
};

export const fetchPremiumArticles = async () => {
    const response = await axios.get(`${API_BASE_URL}/articles/premium`, { headers: getAuthHeaders() });
    return response.data.articles;
};


// --- Admin Article Calls ---

export const fetchAllArticlesAdmin = async (searchParams) => {
    // searchParams could contain { search, status, publisher, page, limit }
    const params = new URLSearchParams(searchParams).toString();
    const response = await axios.get(`${API_BASE_URL}/articles/admin/all?${params}`, { headers: getAuthHeaders() });
    return response.data; // This will contain articles, totalPages, currentPage, totalResults
};

export const approveArticle = async (articleId) => {
    const response = await axios.put(`${API_BASE_URL}/articles/admin/approve/${articleId}`, {}, { headers: getAuthHeaders() });
    return response.data;
};

export const declineArticle = async (articleId, reason) => {
    const response = await axios.put(`${API_BASE_URL}/articles/admin/decline/${articleId}`, { reason }, { headers: getAuthHeaders() });
    return response.data;
};

export const makeArticlePremium = async (articleId) => {
    const response = await axios.put(`${API_BASE_URL}/articles/admin/make-premium/${articleId}`, {}, { headers: getAuthHeaders() });
    return response.data;
};
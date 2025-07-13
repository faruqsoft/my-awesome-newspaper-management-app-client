import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Public Publisher Calls (using TanStack Query for GETs) ---

export const fetchAllPublishers = async () => {
    const response = await axios.get(`${API_BASE_URL}/publishers`);
    return response.data.publishers;
};

// --- Admin Publisher Calls ---

export const addPublisher = async (publisherData) => {
    // publisherData should be FormData for file upload
    const response = await axios.post(`${API_BASE_URL}/publishers`, publisherData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data' // Important for file uploads
        }
    });
    return response.data;
};

export const updatePublisher = async (publisherId, publisherData) => {
    // publisherData can be FormData if logo is updated
    const response = await axios.put(`${API_BASE_URL}/publishers/${publisherId}`, publisherData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data' // Important for file uploads
        }
    });
    return response.data;
};

export const deletePublisher = async (publisherId) => {
    const response = await axios.delete(`${API_BASE_URL}/publishers/${publisherId}`, { headers: getAuthHeaders() });
    return response.data;
};
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Admin-protected endpoint for user statistics
export const fetchUserStatistics = async () => {
    // This is an admin route on the backend, so it needs auth header
    const response = await axios.get(`${API_BASE_URL}/users/statistics`, { headers: getAuthHeaders() });
    return response.data;
};
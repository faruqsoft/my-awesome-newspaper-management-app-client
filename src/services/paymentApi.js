import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Process Payment ---
export const processPayment = async (subscriptionDuration) => {
    const response = await axios.post(`${API_BASE_URL}/payments/process`, { subscriptionDuration }, { headers: getAuthHeaders() });
    return response.data;
};

// --- Fetch User's Payment History (for a 'My Payments' page, if you add one) ---
export const fetchPaymentHistory = async () => {
    const response = await axios.get(`${API_BASE_URL}/payments/history`, { headers: getAuthHeaders() });
    return response.data.payments;
};
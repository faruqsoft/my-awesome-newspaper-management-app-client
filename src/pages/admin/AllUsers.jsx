import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Get auth headers from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Admin user statistics fetcher
const fetchUserStatistics = async () => {
  const response = await axios.get(`${API_BASE_URL}/users/statistics`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, statsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/users`, { headers: getAuthHeaders() }),
          fetchUserStatistics(),
        ]);
        setUsers(userRes.data || []);
        setStats(statsRes);
      } catch (err) {
        const message = err?.response?.data?.message || err.message || 'Failed to fetch users.';
        setError(message);
        console.error('User fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleMakeAdmin = async (id) => {
    setActionLoading(id);
    try {
      await axios.patch(
        `${API_BASE_URL}/users/make-admin/${id}`,
        {},
        { headers: getAuthHeaders() }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, role: 'admin' } : user
        )
      );
    } catch (err) {
      alert('Failed to make admin.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Manage All Users</h1>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded shadow text-center">
            <h2 className="text-xl text-green-700  font-bold">{stats.totalUsers}</h2>
            <p className="text-gray-700">Total Users</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow text-center">
            <h2 className="text-xl text-green-700  font-bold">{stats.premiumUsersCount}</h2>
            <p className="text-gray-700">Premium Users</p>
          </div>
          <div className="bg-blue-100 p-4 rounded shadow text-center">
            <h2 className="text-xl text-green-700  font-bold">{stats.normalUsersCount}</h2>
            <p className="text-gray-700">Free Users</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-lg text-gray-500">Loading users...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-green-100 text-green-800">
                <th className="py-3 px-4 text-left">Profile</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Premium</th>
                <th className="py-3 px-4 text-left">Joined</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-green-50">
                  <td className="py-2 px-4">
                    <img
                      src={
                        user.photoURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.displayName || user.email
                        )}`
                      }
                      alt={user.displayName}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  </td>
                  <td className="py-2 text-green-700  px-4 font-medium">{user.displayName}</td>
                  <td className="py-2 text-green-700  px-4">{user.email}</td>
                  <td className="py-2 px-4">
                    {user.role === 'admin' ? (
                      <span className="text-green-700 font-semibold">Admin</span>
                    ) : (
                      <span className="text-gray-600">User</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {user.premiumTaken ? (
                      <span className="text-yellow-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="py-2 px-4">
                    {user.role === 'admin' ? (
                      <span className="text-green-500 font-bold">—</span>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(user._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded shadow disabled:opacity-60"
                        disabled={actionLoading === user._id}
                      >
                        {actionLoading === user._id ? 'Processing...' : 'Make Admin'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllUsers;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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
      await axios.patch(`${API_BASE_URL}/users/make-admin/${id}`, {}, { headers: getAuthHeaders() });
      setUsers((prev) => prev.map((user) => user._id === id ? { ...user, role: 'admin' } : user));
    } catch (err) {
      alert('Failed to make admin.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-tr from-white to-green-50 min-h-screen rounded-lg shadow-xl">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-10 text-center sm:text-left">
        Manage All Users
      </h1>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-100 p-6 rounded-2xl shadow text-center hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-green-700">{stats.totalUsers}</h2>
            <p className="text-gray-700 mt-1">Total Users</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-2xl shadow text-center hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-yellow-700">{stats.premiumUsersCount}</h2>
            <p className="text-gray-700 mt-1">Premium Users</p>
          </div>
          <div className="bg-blue-100 p-6 rounded-2xl shadow text-center hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-blue-700">{stats.normalUsersCount}</h2>
            <p className="text-gray-700 mt-1">Free Users</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-lg text-gray-500">Loading users...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-[800px] w-full text-sm text-left">
            <thead className="bg-green-200 text-green-900 text-sm uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Profile</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Premium</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-green-50 transition">
                  <td className="py-3 px-4">
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}`}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">{user.displayName}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    {user.role === 'admin' ? (
                      <span className="text-green-700 font-semibold">Admin</span>
                    ) : (
                      <span className="text-gray-500">User</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {user.premiumTaken ? (
                      <span className="text-yellow-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {user.role === 'admin' ? (
                      <span className="text-green-500 font-bold">—</span>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(user._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm shadow transition disabled:opacity-60"
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

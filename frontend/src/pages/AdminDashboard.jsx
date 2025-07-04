import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [stats, setStats] = useState({ totalUsers: 0, totalFiles: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getAdminStats(token);
        setStats(data);
      } catch (err) {
        console.error('📛 Failed to fetch admin stats:', err.message);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6 sm:p-10">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10 space-y-6">
        {/* Welcome Block */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome, Admin</h1>
          <p className="text-gray-600">
            You're logged in as:{' '}
            <span className="font-medium text-black">{user?.email || 'Admin'}</span>
          </p>
        </div>

        {/* Stats Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Total Users</h2>
            <p className="text-3xl font-bold text-blue-900">{stats.totalUsers}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold text-green-700 mb-2">Total Files Uploaded</h2>
            <p className="text-3xl font-bold text-green-900">{stats.totalFiles}</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/admin/uploads')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Go to Admin Uploads
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

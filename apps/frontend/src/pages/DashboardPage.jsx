import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const DashboardPage = () => {
  const [userData, setUserData] = useState({})
  const [uploadStats, setUploadStats] = useState([]) // ✅ default as empty array
  const navigate = useNavigate()
  const baseURL = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await axios.get(`${baseURL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserData(res.data)
      } catch (err) {
        console.error('Failed to fetch user info', err)
        navigate('/unauthorized')
      }
    }

    const fetchHistory = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await axios.get(`${baseURL}/file/history`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUploadStats(res.data.files || []) // ✅ fallback to empty array
      } catch (err) {
        console.error('Failed to fetch upload stats', err)
      }
    }

    fetchUser()
    fetchHistory()
  }, [navigate, baseURL])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 sm:p-10">
      <div className="max-w-screen-lg mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-2">Welcome, {userData.name || 'User'}!</h1>
          <p className="text-lg text-gray-700">
            Role: <span className="font-semibold text-black">{userData.role}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow border border-blue-200">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">📁 Your Uploads</h2>
            <p className="text-gray-700">
              You’ve uploaded{' '}
              <strong className="text-blue-900">
                {Array.isArray(uploadStats) ? uploadStats.length : 0}
              </strong>{' '}
              file(s).
            </p>
          </div>

          {userData.role === 'admin' && (
            <div className="bg-white p-6 rounded-2xl shadow border border-indigo-200">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-2">🛠️ Admin Tools</h2>
              <p className="text-gray-700 mb-4">You can manage and view all user uploads.</p>
              <button
                onClick={() => navigate('/admin/uploads')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-lg transition"
              >
                View Admin Uploads
              </button>
            </div>
          )}

          {userData.role === 'user' && (
            <div className="bg-white p-6 rounded-2xl shadow border border-green-200">
              <h2 className="text-2xl font-semibold text-green-700 mb-2">📊 Start Analyzing</h2>
              <p className="text-gray-700 mb-4">Upload new Excel files and visualize your data.</p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/upload')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-lg transition"
                >
                  Upload File
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-5 py-3 rounded-lg transition"
                >
                  View History
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

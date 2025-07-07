import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
        <div className="text-2xl font-bold tracking-wide">Excel Analytics</div>

        {token && (
          <div className="flex flex-wrap items-center gap-4 mt-3 sm:mt-0 text-sm sm:text-base">
            <Link to="/upload" className="hover:text-yellow-300 transition">Upload</Link>
            <Link to="/history" className="hover:text-yellow-300 transition">History</Link>
            <Link to="/dashboard" className="hover:text-yellow-300 transition">Dashboard</Link>
            {user?.role === 'admin' && (
              <Link to="/admin/uploads" className="hover:text-yellow-300 transition">
                Admin Uploads
              </Link>
            )}
          </div>
        )}

        <div className="mt-3 sm:mt-0">
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-medium transition"
            >
              Logout
            </button>
          ) : (
            <div className="flex space-x-4 text-sm sm:text-base">
              <Link to="/" className="hover:text-yellow-300 transition">Login</Link>
              <Link to="/register" className="hover:text-yellow-300 transition">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

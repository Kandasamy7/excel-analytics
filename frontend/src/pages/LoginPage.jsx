import { useState } from 'react'
import { loginUser } from '../services/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await loginUser({ email, password })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role
      }))

      toast.success('Login successful')

      if (res.data.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/upload')
      }
    } catch (err) {
      console.error('Login failed:', err)
      toast.error('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-700">Sign In to Your Account</h2>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-lg font-semibold transition duration-300"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account? <a href="/register" className="text-indigo-600 hover:underline">Register</a>
        </p>
      </form>
    </div>
  )
}

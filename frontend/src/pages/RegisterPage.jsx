import { useState } from 'react'
import { registerUser } from '../services/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await registerUser({ name, email, password })
      toast.success('Registered successfully')
      navigate('/')
    } catch (err) {
      console.error('Registration error:', err)
      toast.error('Registration failed. Try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-emerald-700">Create a New Account</h2>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-lg font-semibold transition duration-300"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account? <a href="/" className="text-emerald-600 hover:underline">Login</a>
        </p>
      </form>
    </div>
  )
}

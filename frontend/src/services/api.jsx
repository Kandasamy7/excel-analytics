import axios from 'axios'

// ✅ Use env variable for Docker/Dev flexibility
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Get token from localStorage (if logged in)
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ===== Auth APIs =====
export const registerUser = async (userData) =>
  axios.post(`${API_BASE_URL}/auth/register`, userData)

export const loginUser = async (userData) =>
  axios.post(`${API_BASE_URL}/auth/login`, userData)

export const getCurrentUser = async () =>
  axios.get(`${API_BASE_URL}/auth/me`, { headers: getAuthHeader() })

// ===== File APIs =====
export const uploadFile = async (formData) =>
  axios.post(`${API_BASE_URL}/file/upload`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    },
  })

export const getUploadHistory = async () =>
  axios.get(`${API_BASE_URL}/file/history`, { headers: getAuthHeader() })

export const getFileDataById = async (id) =>
  axios.get(`${API_BASE_URL}/file/data/${id}`, { headers: getAuthHeader() })

export const getUserStats = async (token) => {
  const res = await fetch(`${API_BASE_URL}/user/stats`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.json()
}

export const getAdminStats = async (token) => {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    throw new Error(`Admin stats fetch failed with status: ${res.status}`)
  }

  return res.json()
}

export const deleteFile = async (id, token, role) => {
  const endpoint = role === 'admin'
    ? `${API_BASE_URL}/admin/delete/${id}`
    : `${API_BASE_URL}/file/${id}`

  const res = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) throw new Error('Failed to delete')
  return res.json()
}

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const HistoryPage = () => {
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const navigate = useNavigate()
  const baseURL = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token')

        // Get user role
        const me = await axios.get(`${baseURL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setRole(me.data.role)

        // Get upload history
        const res = await axios.get(`${baseURL}/file/history`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUploads(res.data.files)
      } catch (err) {
        toast.error('Failed to fetch upload history')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [baseURL])

  const handleView = (id) => navigate(`/chart/${id}`)

 const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this file?')) return
  try {
    const token = localStorage.getItem('token')
    const deletePath = `${baseURL}/file/${id}`

    await axios.delete(deletePath, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setUploads(prev => prev.filter(file => file.id !== id))
    toast.success('File deleted successfully')
  } catch (err) {
    toast.error('Failed to delete file')
    console.error(err)
  }
}


  const handleDownload = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${baseURL}/file/download/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      })

      const file = uploads.find(f => f.id === id)
      const fileName = file?.name || `file-${id}.xlsx`

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      toast.success('File downloaded')
    } catch (err) {
      toast.error('Failed to download file')
      console.error(err)
    }
  }

  if (loading) return <p className="p-6 text-lg font-semibold text-blue-600">Loading your upload history...</p>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-purple-700">📁 My Upload History</h2>

      <input
        type="text"
        placeholder="🔍 Search by file name..."
        className="mb-6 p-3 border border-gray-300 rounded-md w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {uploads.length === 0 ? (
        <p className="text-gray-600">No uploads found.</p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="w-full border text-left bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="p-3 border">📄 File Name</th>
                <th className="p-3 border">📅 Uploaded At</th>
                <th className="p-3 border text-center">⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploads
                .filter(file => file.name.toLowerCase().includes(search.toLowerCase()))
                .map(file => (
                  <tr key={file.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 border">{file.name}</td>
                    <td className="p-3 border">{new Date(file.uploadedAt).toLocaleString()}</td>
                    <td className="p-3 border text-center space-x-2">
                      <button
                        onClick={() => handleView(file.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                      >
                        📊 View
                      </button>
                      <button
                        onClick={() => handleDownload(file.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                      >
                        ⬇ Download
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
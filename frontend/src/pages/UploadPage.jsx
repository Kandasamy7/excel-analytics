import { useState } from 'react'
import { uploadFile } from '../services/api'
import toast from 'react-hot-toast'

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please choose a file')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    try {
      await uploadFile(formData)
      toast.success('File uploaded successfully!')
      setFile(null)
    } catch (err) {
      console.error(err)
      toast.error('Upload failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleUpload}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-purple-700 text-center">📤 Upload Excel File</h2>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Select File</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
}

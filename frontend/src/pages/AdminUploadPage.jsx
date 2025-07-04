import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const AdminUploadPage = () => {
  const [uploads, setUploads] = useState([])
  const [chartData, setChartData] = useState(null)
  const [selectedColumn, setSelectedColumn] = useState('')
  const [chartType, setChartType] = useState('bar')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const baseURL = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${baseURL}/file/all-uploads`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUploads(res.data.files)
      } catch (err) {
        alert('Failed to fetch uploads')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUploads()
  }, [baseURL])

  const handlePreview = async (fileId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${baseURL}/file/data/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setChartData(res.data)
      setSelectedColumn('')
    } catch (err) {
      alert('Failed to fetch file data')
      console.error(err)
    }
  }

 const handleDelete = async (fileId) => {
  if (!window.confirm('Are you sure you want to delete this file?')) return
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`${baseURL}/file/admin/${fileId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setUploads(prev => prev.filter(f => f.id !== fileId))
    alert('File deleted successfully')
  } catch (err) {
    alert('Failed to delete file')
    console.error(err)
  }
}


  const generateColors = (count) => {
    const colors = []
    for (let i = 0; i < count; i++) {
      const hue = Math.floor((360 / count) * i)
      colors.push(`hsl(${hue}, 100%, 70%)`)
    }
    return colors
  }

  const generateChartData = () => {
    if (!selectedColumn || !chartData) return null

    const valueCount = {}
    chartData.rows.forEach(row => {
      const val = row[selectedColumn]
      if (val !== undefined && val !== '') {
        valueCount[val] = (valueCount[val] || 0) + 1
      }
    })

    const labels = Object.keys(valueCount)
    const data = Object.values(valueCount)
    const colors = generateColors(labels.length)

    return {
      labels,
      datasets: [{
        label: selectedColumn,
        data,
        backgroundColor: colors,
        borderColor: colors.map(c => c.replace('70%', '50%')),
        borderWidth: 1,
      }]
    }
  }

  const chartProps = {
    data: generateChartData(),
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: `Chart for ${selectedColumn}`,
        },
      },
    },
  }

  if (loading) return <p className="p-4">Loading uploads...</p>

  return (
    <div className="p-6 sm:p-10 bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-bold text-blue-800">📂 All Uploaded Files (Admin View)</h2>
    <button
      onClick={() => navigate('/dashboard')}
      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
    >
      ⬅ Back to Dashboard
    </button>
  </div>

  {uploads.length === 0 ? (
    <p className="text-gray-600">No files uploaded yet.</p>
  ) : (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="w-full text-sm text-left border border-gray-200 bg-white">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="p-4 border">User Email</th>
            <th className="p-4 border">File Name</th>
            <th className="p-4 border">Uploaded At</th>
            <th className="p-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map((file) => (
            <tr key={file.id} className="hover:bg-gray-50">
              <td className="p-4 border">{file.user || 'Unknown'}</td>
              <td className="p-4 border">{file.name || 'Untitled'}</td>
              <td className="p-4 border">{new Date(file.uploadedAt).toLocaleString()}</td>
              <td className="p-4 border space-x-2">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
                  onClick={() => handlePreview(file.id)}
                >
                  View Chart
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                  onClick={() => handleDelete(file.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  {chartData && (
    <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-indigo-700">
        📊 {chartData.name} — Rows: {chartData.rows.length}
      </h3>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Choose Column to Visualize:</label>
          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setSelectedColumn(e.target.value)}
            value={selectedColumn}
          >
            <option value="">-- Select Column --</option>
            {chartData.columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Chart Type:</label>
          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            <option value="doughnut">Doughnut</option>
            <option value="line">Line</option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        {selectedColumn && (() => {
          switch (chartType) {
            case 'pie': return <Pie {...chartProps} />
            case 'doughnut': return <Doughnut {...chartProps} />
            case 'line': return <Line {...chartProps} />
            default: return <Bar {...chartProps} />
          }
        })()}
      </div>
    </div>
  )}
</div>
  )
}

export default AdminUploadPage

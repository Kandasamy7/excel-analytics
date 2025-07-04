import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
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
import toast, { Toaster } from 'react-hot-toast'

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

const UserUploadHistory = () => {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedColumn, setSelectedColumn] = useState('')
  const [chartType, setChartType] = useState('bar')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const chartRef = useRef(null)

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/file/history`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setFiles(res.data.files)
      } catch (err) {
        console.error('Error fetching user files:', err)
        toast.error('Failed to load files')
      }
    }

    fetchUserFiles()
  }, [])

  const handlePreview = async (fileId) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/file/data/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSelectedFile(res.data)
      setSelectedColumn('')
      toast.success('File loaded successfully')
    } catch (err) {
      console.error('Error loading chart data:', err)
      toast.error('Failed to load chart data')
    } finally {
      setLoading(false)
    }
  }

  const generateChartData = () => {
    if (!selectedColumn || !selectedFile) return null
    const valueCount = {}

    selectedFile.rows.forEach(row => {
      const val = row[selectedColumn]
      if (val !== undefined && val !== '') {
        valueCount[val] = (valueCount[val] || 0) + 1
      }
    })

    const labels = Object.keys(valueCount)
    const data = Object.values(valueCount)

    return {
      labels,
      datasets: [{
        label: selectedColumn,
        data,
        backgroundColor: labels.map((_, i) => `hsl(${(360 / labels.length) * i}, 70%, 60%)`),
        borderColor: labels.map((_, i) => `hsl(${(360 / labels.length) * i}, 70%, 40%)`),
        borderWidth: 1,
      }]
    }
  }

  const downloadChart = () => {
    const chartInstance = chartRef.current
    if (!chartInstance || !chartInstance.toBase64Image) return
    const link = document.createElement('a')
    link.href = chartInstance.toBase64Image()
    link.download = `${selectedFile.name}-${selectedColumn}-chart.png`
    link.click()
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
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">📁 Your Uploaded Files</h2>

      <input
        type="text"
        placeholder="Search files by name..."
        className="mb-4 p-2 border rounded w-full sm:w-1/2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto mb-6">
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">File Name</th>
              <th className="p-2 border">Uploaded At</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {files
              .filter(file => file.name.toLowerCase().includes(search.toLowerCase()))
              .map(file => (
                <tr key={file.id}>
                  <td className="p-2 border">{file.name}</td>
                  <td className="p-2 border">{new Date(file.uploadedAt).toLocaleString()}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handlePreview(file.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View Chart
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {loading && <p className="text-blue-600 font-medium mb-4">Loading chart data...</p>}

      {selectedFile && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">
            📊 File: {selectedFile.name} — Rows: {selectedFile.rows.length}
          </h3>

          <label className="block mb-2 font-medium">Choose Column to Visualize:</label>
          <select
            className="p-2 border rounded mb-4 w-full sm:w-1/2"
            onChange={(e) => setSelectedColumn(e.target.value)}
            value={selectedColumn}
          >
            <option value="">-- Select Column --</option>
            {selectedFile.columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>

          <label className="block mb-2 font-medium">Chart Type:</label>
          <select
            className="p-2 border rounded mb-4 w-full sm:w-1/2"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            <option value="doughnut">Doughnut</option>
            <option value="line">Line</option>
          </select>

          {selectedColumn && (
            <div className="mb-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={downloadChart}
              >
                ⬇ Download Chart as PNG
              </button>
            </div>
          )}

          {selectedColumn && (() => {
            const props = { ...chartProps, ref: chartRef }
            switch (chartType) {
              case 'pie': return <Pie {...props} />
              case 'doughnut': return <Doughnut {...props} />
              case 'line': return <Line {...props} />
              default: return <Bar {...props} />
            }
          })()}
        </div>
      )}
    </div>
  )
}

export default UserUploadHistory

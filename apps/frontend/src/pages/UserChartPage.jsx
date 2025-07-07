import axios from 'axios'
import { useEffect, useState } from 'react'
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

const UserChartPage = () => {
  const [uploads, setUploads] = useState([])
  const [chartData, setChartData] = useState(null)
  const [selectedFileId, setSelectedFileId] = useState(null)
  const [selectedColumn, setSelectedColumn] = useState('')
  const [chartType, setChartType] = useState('bar')
  const [loading, setLoading] = useState(true)
  const baseURL = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const fetchUserUploads = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${baseURL}/file/history`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUploads(res.data.files)
      } catch (err) {
        alert('Failed to fetch user uploads')
        console.error('User upload fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUserUploads()
  }, [baseURL])

  const handlePreview = async (fileId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${baseURL}/file/data/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSelectedFileId(fileId)
      setChartData(res.data)
      setSelectedColumn('')
    } catch (err) {
      alert('Failed to fetch chart data')
      // console.error(err)
    }
  }

  const generateColors = (count) => {
    const colors = []
    for (let i = 0; i < count; i++) {
      const hue = Math.floor((360 / count) * i)
      colors.push(`hsl(${hue}, 80%, 60%)`)
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
    const values = Object.values(valueCount)
    const colors = generateColors(labels.length)

    return {
      labels,
      datasets: [{
        label: selectedColumn,
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(c => c.replace('60%', '50%')),
        borderWidth: 1,
      }],
    }
  }

  if (loading) return <p className="p-4">Loading uploads...</p>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Uploaded Files</h2>
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">File Name</th>
            <th className="p-2 border">Uploaded At</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map(file => (
            <tr key={file.id}>
              <td className="p-2 border">{file.name}</td>
              <td className="p-2 border">{new Date(file.uploadedAt).toLocaleString()}</td>
              <td className="p-2 border">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => handlePreview(file.id)}
                >
                  View Chart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {chartData && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Chart for File ID: {selectedFileId}</h3>

          <label className="block mb-2 font-medium">Choose Column to Visualize:</label>
          <select
            className="p-2 border rounded mb-4"
            onChange={(e) => setSelectedColumn(e.target.value)}
            value={selectedColumn}
          >
            <option value="">-- Select Column --</option>
            {chartData.columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>

          <label className="block mb-2 font-medium">Choose Chart Type:</label>
          <select
            className="p-2 border rounded mb-4"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            <option value="doughnut">Doughnut</option>
            <option value="line">Line</option>
          </select>

          {selectedColumn && (() => {
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

            switch (chartType) {
              case 'pie': return <Pie {...chartProps} />
              case 'doughnut': return <Doughnut {...chartProps} />
              case 'line': return <Line {...chartProps} />
              default: return <Bar {...chartProps} />
            }
          })()}
        </div>
      )}
    </div>
  )
}

export default UserChartPage

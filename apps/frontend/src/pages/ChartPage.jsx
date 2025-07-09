import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Chart } from 'react-chartjs-2'
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
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

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

const ChartPage = () => {
  const { id } = useParams()
  const [fileData, setFileData] = useState(null)
  const [xAxisColumn, setXAxisColumn] = useState('')
  const [yAxisColumn, setYAxisColumn] = useState('')
  const [chartType, setChartType] = useState('bar')
  const chartRef = useRef(null)

  const baseURL = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${baseURL}/file/data/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setFileData(res.data)
      } catch (err) {
        alert('Failed to fetch file data')
        console.error(err)
      }
    }

    fetchFileData()
  }, [id, baseURL])

  const getTimestamp = () => {
    const now = new Date()
    const date = now.toLocaleDateString().replace(/\//g, '-')
    const time = now.toLocaleTimeString().replace(/:/g, '-').replace(/\s/g, '')
    return `${date}-${time}`
  }

  const generateChartData = () => {
    if (!fileData || !xAxisColumn || !yAxisColumn) return null

    const groupedData = {}
    fileData.rows.forEach(row => {
      const xVal = row[xAxisColumn]
      const yVal = parseFloat(row[yAxisColumn])
      if (xVal !== undefined && yVal && !isNaN(yVal)) {
        groupedData[xVal] = (groupedData[xVal] || 0) + yVal
      }
    })

    return {
      labels: Object.keys(groupedData),
      datasets: [{
        label: `${yAxisColumn} per ${xAxisColumn}`,
        data: Object.values(groupedData),
        backgroundColor: Object.keys(groupedData).map((_, i) =>
          `hsl(${(i * 360) / Object.keys(groupedData).length}, 80%, 60%)`
        ),
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: '#6366F1'
      }]
    }
  }

  const chartProps = {
    data: generateChartData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: `Chart for ${xAxisColumn} vs ${yAxisColumn}`
        },
        tooltip: {
          callbacks: {
            label: context =>
              `${context.label}: ${context.parsed.y ?? context.parsed}`
          }
        }
      },
      scales: (chartType === 'bar' || chartType === 'line') ? {
        x: { title: { display: true, text: xAxisColumn } },
        y: {
          title: { display: true, text: yAxisColumn },
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      } : {}
    }
  }

  const handleNativePngExport = () => {
    if (!chartRef.current) return
    const link = document.createElement('a')
    link.download = `Chart-${xAxisColumn}-vs-${yAxisColumn}-${chartType}-${getTimestamp()}.png`
    link.href = chartRef.current.toBase64Image()
    link.click()
  }

  const handleFullPngExport = async () => {
    const canvas = await html2canvas(document.querySelector('#chart-area'))
    const link = document.createElement('a')
    link.download = `FullChart-${xAxisColumn}-vs-${yAxisColumn}-${chartType}-${getTimestamp()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handlePDFExport = () => {
    const doc = new jsPDF()
    doc.text(`Chart: ${xAxisColumn} vs ${yAxisColumn}`, 10, 10)
    doc.addImage(chartRef.current.toBase64Image(), 'PNG', 10, 20, 180, 100)
    doc.save(`Chart-${xAxisColumn}-vs-${yAxisColumn}-${chartType}-${getTimestamp()}.pdf`)
  }

  if (!fileData) return <p className="p-4">Loading file data...</p>

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-2">{fileData.name}</h2>

      <table className="w-full border text-sm text-left">
        <thead className="bg-gray-200">
          <tr>
            {Object.keys(fileData.rows[0] || {}).map((key) => (
              <th key={key} className="p-1 border">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fileData.rows.slice(0, 5).map((row, rowIdx) => (
            <tr key={rowIdx}>
              {Object.entries(row).map(([col, val]) => (
                <td key={`${rowIdx}-${col}`} className="p-1 border">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block font-medium mb-1">X-Axis Column:</label>
          <select
            className="p-2 border rounded"
            value={xAxisColumn}
            onChange={(e) => setXAxisColumn(e.target.value)}
          >
            <option value="">-- Choose --</option>
            {fileData.columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Y-Axis Column:</label>
          <select
            className="p-2 border rounded"
            value={yAxisColumn}
            onChange={(e) => setYAxisColumn(e.target.value)}
          >
            <option value="">-- Choose --</option>
            {fileData.columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Chart Type:</label>
          <select
            className="p-2 border rounded"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
            <option value="doughnut">Doughnut</option>
          </select>
        </div>
      </div>

      {xAxisColumn && yAxisColumn && generateChartData() && (
        <div
          id="chart-area"
          className="bg-white p-3 rounded shadow mx-auto overflow-hidden"
          style={{ maxWidth: '600px', height: '400px' }}
        >
          <Chart
            ref={chartRef}
            type={chartType}
            data={chartProps.data}
            options={chartProps.options}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      {xAxisColumn && yAxisColumn && (
        <div className="flex gap-3 mt-4 flex-wrap">
          <button onClick={handleNativePngExport} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
            Download Chart (Native PNG)
          </button>
          <button onClick={handleFullPngExport} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Export as PNG (Full)
          </button>
          <button onClick={handlePDFExport} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            Export as PDF
          </button>
        </div>
      )}
    </div>
  )
}

export default ChartPage

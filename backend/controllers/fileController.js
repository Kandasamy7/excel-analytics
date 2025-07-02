const XLSX = require('xlsx')
const File = require('../models/File')
const User = require('../models/User')

// Upload and parse Excel file
exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

    const newFile = new File({
      user: req.user._id,
      originalName: req.file.originalname,
      data
    })

    await newFile.save()

    res.status(200).json({
      message: 'File uploaded & parsed successfully',
      rows: data.length,
      dataPreview: data.slice(0, 5)
    })
  } catch (err) {
    console.error('Upload failed:', err)
    res.status(500).json({ message: 'Upload failed', error: err.message })
  }
}

// Get list of uploaded files for user
exports.getUploadHistory = async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id })
      .select('originalName createdAt')
      .sort({ createdAt: -1 })

    res.status(200).json({
      files: files.map(file => ({
        id: file._id,
        name: file.originalName,
        uploadedAt: file.createdAt
      }))
    })
  } catch (error) {
    console.error('History fetch failed:', error)
    res.status(500).json({ message: 'Failed to get upload history' })
  }
}

// Get file content for chart
exports.getFileData = async (req, res) => {
  try {
    const { id } = req.params
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: 'Invalid file ID' })
    }

    const file = req.user.role === 'admin'
     ? await File.findById(id).populate('user', 'email') : await File.findOne({ _id: id, user: req.user._id})

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    const columns = Object.keys(file.data[0] || {})// Get column names from the first row

    res.status(200).json({
      name: file.originalName,
      columns,
      rows: file.data
    })
  } catch (error) {
    console.error('Chart data error:', error)
    res.status(500).json({ message: 'Failed to get file' })
  }
}
// //get all uploaded files fro admin
// exports.getAllUploadedFiles = async (req, res) => {
//   try {
//     const files = await file.find().populate('user','email')
//     res.status(200).json(files)
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'server error'})
//   }
// }

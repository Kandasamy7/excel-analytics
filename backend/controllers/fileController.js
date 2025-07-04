const XLSX = require('xlsx')
const File = require('../models/File')
const { Readable } = require('stream')

/**
 * Upload and parse Excel file
 */
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

/**
 * Get list of uploaded files for the logged-in user
 */
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

/**
 * Get file data for generating chart
 */
exports.getFileData = async (req, res) => {
  try {
    const { id } = req.params
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: 'Invalid file ID' })
    }

    const file = req.user.role === 'admin'
      ? await File.findById(id).populate('user', 'email')
      : await File.findOne({ _id: id, user: req.user._id })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    const columns = Object.keys(file.data[0] || {})

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

/**
 * Delete file by ID (for owner or admin)
 */
exports.deleteFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    if (file.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    await File.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'File deleted successfully' })
  } catch (err) {
    console.error('Delete error:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}



/**
 * Download file as Excel
 */
exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params

    const file = await File.findOne({ _id: id, user: req.user._id })
    if (!file) return res.status(404).json({ message: 'File not found' })

    const worksheet = XLSX.utils.json_to_sheet(file.data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)
    stream.pipe(res)
  } catch (error) {
    console.error('Download error:', error)
    res.status(500).json({ message: 'Failed to download file' })
  }
}

/**
 * Admin: Get all uploads
 */
exports.getAllUploads = async (req, res) => {
  try {
    const files = await File.find().populate('user', 'email').sort({ createdAt: -1 })

    const formatted = files.map(file => ({
      id: file._id,
      user: file.user.email,
      name: file.originalName,
      uploadedAt: file.createdAt
    }))

    res.status(200).json({ files: formatted })
  } catch (error) {
    console.error('Admin file fetch error:', error)
    res.status(500).json({ message: 'Server error while fetching uploads' })
  }
}

/**
 * Admin: Delete file
 */
exports.deleteFileAsAdmin = async (req, res) => {
  try {
    const deleted = await File.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: 'File not found' })
    }

    res.status(200).json({ message: 'Admin: File deleted successfully' })
  } catch (err) {
    console.error('Admin delete error:', err)
    res.status(500).json({ message: 'Server error during admin delete' })
  }
}


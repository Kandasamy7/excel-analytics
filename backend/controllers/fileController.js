const XLSX = require('xlsx')
const File = require('../models/File')

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
      data: data,
    })

    await newFile.save()

    res.status(200).json({
      message: 'File uploaded & parsed successfully',
      rows: data.length,
      dataPreview: data.slice(0, 5),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Upload failed', error: err.message })
  }
}

exports.getUploadHistory = async (req, res) => {
  try {
    // console.log(' Getting upload history for:', req.user._id) / Debugging line to check user id

    const files = await File.find({ user: req.user._id })
      .select('originalName createdAt')
      .sort({ createdAt: -1 })

    // console.log(' Found files:', files) //Debugging line to check found files

    // Send a clean, trimmed-down response
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
exports.getFileData = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    if(!file) {
      return res.status(404).json({message: 'File not found'})
    }
    const columns = Object.keys(file.data[0] || {}) // Get the column names from the first row of data

    res.status(200).json({
      name: file.originalName,
      columns:columns,
      rows: file.data
    })
  } catch (error) {
      console.log("chart data error", error);
      res.status(500).json({message: 'failed to get file'});
      
  }
}


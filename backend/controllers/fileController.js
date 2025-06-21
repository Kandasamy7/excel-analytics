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

const XLSX = require('xlsx');
const file = require('../models/File')

exports.uploadExcel = async (req, res) => {
    try {
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'upload failed', error: err.message})
        
    }
}
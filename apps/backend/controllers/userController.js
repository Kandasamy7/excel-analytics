const File = require('../models/File')
const User = require('../models/User')

const getUserStats = async (req, res) => {
    try {
        const userId = req.user.userId
        const uploads = await File.find({
            user: userId
        }).sort({ createdAt: -1})

        const totalUploads = uploads.length
        const lastUpload = uploads[0]?.createdAt || null

        res.json({ totalUploads, lastUpload})
        
    } catch (err) {
        res.status(500).json({ error: 'Failed to get stats'})
    }
}
module.exports = { getUserStats }
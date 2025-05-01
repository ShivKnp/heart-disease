const fs = require('fs');
const path = require('path');

exports.downloadReport = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../../../heart-disease/reports', filename);
        
        console.log(`[Download] Attempting: ${filePath}`);
        
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }
        res.status(404).json({ error: 'Report not found' });
    } catch (error) {
        console.error('[Download] Error:', error);
        res.status(500).json({ error: 'Failed to download report' });
    }
};
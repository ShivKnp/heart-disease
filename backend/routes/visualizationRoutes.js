const express = require('express');
const path = require('path');
const router = express.Router();

// Path to visualizations from backend directory
const visualizationDir = path.join(__dirname, '../../ml_model/visualizations');

router.get('/:filename', (req, res) => {
    try {
        const filePath = path.join(visualizationDir, req.params.filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Visualization not found' });
        }
        
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error serving visualization:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
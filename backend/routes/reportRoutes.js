// In reportRoutes.js or a new visualizationRoutes.js

const express = require('express');
const path = require('path');
const router = express.Router();

const visualizationDir = path.join(__dirname, '../../ml_model/visualizations');

router.get('/:filename', (req, res) => {
    const filePath = path.join(visualizationDir, req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending visualization:', err);
            res.status(404).json({ error: 'Visualization not found' });
        }
    });
});

module.exports = router;
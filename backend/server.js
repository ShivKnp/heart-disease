require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const reportRoutes = require('./routes/reportRoutes');


// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the correct project reports directory
app.use('/reports', express.static(
  path.join('../reports')
));

app.use('/reports', (req, res, next) => {
  console.log('Attempting to access report:', req.path);
  next();
});

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', predictionRoutes);
app.use('/api', reportRoutes);
app.use('/visualizations', express.static(
  'C:/Users/Shiva/OneDrive/Desktop/heart-disease/ml_model/visualizations'
));




// Debugging endpoints (can be removed in production)
app.get('/test-report', (req, res) => {
  const testPath = path.join(__dirname, '../reports/test.pdf');
  if (require('fs').existsSync(testPath)) {
    return res.sendFile(testPath);
  }
  res.status(404).json({ error: 'Test report not found. Create a test.pdf file first.' });
});

app.get('/list-reports', (req, res) => {
  const reportsDir = path.join(__dirname, '../reports');
  require('fs').readdir(reportsDir, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ files });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Reports directory: ${path.join(__dirname, '../reports')}`);
});
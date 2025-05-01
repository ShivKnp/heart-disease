const axios = require('axios');
const path = require('path');
const PatientData = require('../models/PatientData');
const Report = require('../models/Report');
const generateReport = require('../utils/reportGenerator');

exports.predict = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
            'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
        ];

        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === null) {
                return res.status(400).json({ 
                    error: `Missing required field: ${field}` 
                });
            }
        }

        // Convert to numerical data
        const numericalData = {};
        Object.entries(req.body).forEach(([key, value]) => {
            numericalData[key] = Number(value);
        });

        // Get ML prediction
        const mlResponse = await axios.post(
            process.env.ML_API_URL,
            numericalData,
            { timeout: 5000 }
        );

        if (!mlResponse.data) {
            throw new Error('No response from ML API');
        }

        // Save patient data
        const patientData = new PatientData({
            userId: req.user.id,
            medicalInputs: numericalData,
            predictions: mlResponse.data
        });
        await patientData.save();

        // Generate and save report
        const report = await generateReport(req.user, patientData, mlResponse.data);
        
        const reportRecord = new Report({
            userId: req.user.id,
            patientDataId: patientData._id,
            reportUrl: report.url,
            filename: report.filename
        });
        await reportRecord.save();

        // Return response
        res.json({
            predictions: {
                ...mlResponse.data,
                reportUrl: report.url,
                filename: report.filename
            }
        });

    } catch (error) {
        console.error('[Prediction] Error:', error);
        res.status(500).json({ 
            error: error.message || 'Prediction failed. Please try again.' 
        });
    }
};
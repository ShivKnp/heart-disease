const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

module.exports = async (user, patientData, prediction) => {
    const doc = new PDFDocument();
    
    // Ensure reports directory exists in project root
    const reportsDir = path.join(__dirname, '../../../reports');
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const filename = `${Date.now()}_report.pdf`;
    const reportPath = path.join(reportsDir, filename);
    const stream = fs.createWriteStream(reportPath);
    
    doc.pipe(stream);

    // Add report header
    doc.fontSize(20).text('Heart Disease Risk Assessment Report', { align: 'center' });
    doc.moveDown();
    
    // User Information
    doc.fontSize(14).text('Patient Information', { underline: true });
    doc.fontSize(12).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    
    // Medical Inputs
    doc.fontSize(14).text('Medical Inputs', { underline: true });
    for (const [key, value] of Object.entries(patientData.medicalInputs)) {
        doc.text(`${key}: ${value}`);
    }
    doc.moveDown();
    
    // Prediction Results
    doc.fontSize(14).text('Prediction Results', { underline: true });
    doc.text(`Primary Model: ${prediction.primary_prediction.model_name}`);
    doc.text(`Risk Level: ${prediction.primary_prediction.prediction ? 'High Risk' : 'Low Risk'}`);
    doc.text(`Probability: ${(prediction.primary_prediction.probability * 100).toFixed(2)}%`);
    doc.moveDown();
    
    // All Model Predictions
    doc.fontSize(14).text('All Model Predictions', { underline: true });
    for (const [modelName, modelData] of Object.entries(prediction.all_predictions)) {
        doc.text(`${modelData.model_name}:`);
        doc.text(`  Prediction: ${modelData.prediction ? 'High Risk' : 'Low Risk'}`);
        doc.text(`  Probability: ${(modelData.probability * 100).toFixed(2)}%`);
        doc.moveDown();
    }
    
    // Recommendations
    doc.fontSize(14).text('Recommendations', { underline: true });
    if (prediction.primary_prediction.prediction) {
        doc.text('Based on your assessment, you may be at risk for heart disease. We recommend:');
        doc.list([
            'Consulting with a cardiologist',
            'Regular cardiovascular exercise',
            'Low-sodium, heart-healthy diet',
            'Stress reduction techniques',
            'Regular blood pressure monitoring'
        ]);
    } else {
        doc.text('Based on your assessment, you appear to have low risk of heart disease. Maintain:');
        doc.list([
            'Balanced diet with omega-3 fatty acids',
            '150 minutes of weekly exercise',
            'Healthy cholesterol levels',
            'Annual physical examinations',
            'Avoidance of tobacco products'
        ]);
    }
    
    doc.end();
    
    return new Promise((resolve, reject) => {
        stream.on('finish', () => {
            console.log(`[Report Generator] Report successfully saved to: ${reportPath}`);
            resolve(`/reports/${filename}`);
        });
        stream.on('error', (err) => {
            console.error('[Report Generator] Error saving report:', err);
            reject(err);
        });
    });
};
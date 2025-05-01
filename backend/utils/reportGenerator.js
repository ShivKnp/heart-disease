const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const Chart = require('chart.js/auto');

// Helper function to format model names
function formatModelName(model) {
  return model
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper to draw a horizontal line
function drawLine(doc, y) {
  doc.moveTo(50, y).lineTo(550, y).stroke();
}

// Helper to add a small table
function addKeyValueTable(doc, data, startY) {
  const startX = 50;
  const keyWidth = 200;
  const valueWidth = 300;
  const rowHeight = 20;
  let y = startY;

  for (const [key, value] of Object.entries(data)) {
    doc.font('Helvetica-Bold').fontSize(12).text(key, startX, y, { width: keyWidth });
    doc.font('Helvetica').fontSize(12).text(value, startX + keyWidth, y, { width: valueWidth });
    y += rowHeight;
  }
  return y;
}

// Helper to safely add images
function addImageToPDF(doc, imagePath, caption) {
  try {
    if (fs.existsSync(imagePath)) {
      doc.moveDown();
      doc.image(imagePath, {
        fit: [450, 300],
        align: 'center',
        valign: 'center'
      });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('gray').text(caption, { align: 'center' });
      doc.moveDown();
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error adding image to PDF:', err);
    return false;
  }
}

module.exports = async (user, patientData, prediction) => {
  const doc = new PDFDocument({ margin: 50 });
  const visualizationDir = path.join(__dirname, '../../ml_model/visualizations');
  const reportsDir = path.join(__dirname, '../../reports');
  
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const filename = `${Date.now()}_report.pdf`;
  const reportPath = path.join(reportsDir, filename);
  const stream = fs.createWriteStream(reportPath);
  
  doc.pipe(stream);

  // Header
  //doc.image(path.join(__dirname, 'clinic_logo.png'), 50, 20, { width: 50 }).moveUp();
  doc.fontSize(20).text('Heart Disease Risk Assessment Report', 110, 30, { align: 'center' });
  doc.fontSize(12).text('Based on Cleveland Dataset (303+ patients)', { align: 'center' });
  drawLine(doc, 70);

  // Patient Details
  doc.moveDown(2);
  doc.fontSize(16).fillColor('black').text('Patient Information', { underline: true });
  doc.moveDown(0.5);
  const patientInfo = {
    'Name': user.name,
    'Email': user.email,
    'Report Date': new Date().toLocaleDateString()
  };
  let nextY = addKeyValueTable(doc, patientInfo, doc.y + 10);

  drawLine(doc, nextY + 10);

  // Medical Inputs
  doc.addPage();
  doc.fontSize(16).text('Medical Inputs', { underline: true });
  doc.moveDown(0.5);
  addKeyValueTable(doc, patientData.medicalInputs, doc.y + 10);
  drawLine(doc, doc.y + 10);

  // Prediction Results
  doc.addPage();
  doc.fontSize(16).text('Prediction Results Summary', { underline: true });
  doc.moveDown(1);
  
  const tableStartY = doc.y;
  doc.font('Helvetica-Bold').text('Model', 50, tableStartY);
  doc.text('Risk', 250, tableStartY);
  doc.text('Probability (%)', 400, tableStartY);

  doc.moveDown(0.5);
  drawLine(doc, doc.y);

  doc.font('Helvetica');
  Object.values(prediction.all_predictions).forEach(pred => {
    const risk = pred.prediction ? 'High' : 'Low';
    doc.text(formatModelName(pred.model_name), 50, doc.y + 10);
    doc.text(risk, 250, doc.y);
    doc.text((pred.probability * 100).toFixed(2) + '%', 400, doc.y);
    doc.moveDown(0.5);
  });

  drawLine(doc, doc.y + 10);

  // Main Prediction
  doc.moveDown(2);
  doc.fontSize(14).font('Helvetica-Bold').text('Primary Model Decision');
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(12);
  doc.text(`Model: ${formatModelName(prediction.primary_prediction.model_name)}`);
  doc.text(`Predicted Risk: ${prediction.primary_prediction.prediction ? 'High Risk' : 'Low Risk'}`);
  doc.text(`Probability: ${(prediction.primary_prediction.probability * 100).toFixed(2)}%`);

  // Add Model Performance Charts
  doc.addPage();
  doc.fontSize(16).text('Model Performance Visualizations', { underline: true });
  addImageToPDF(doc, path.join(visualizationDir, 'model_predictions_chart.png'), 'Model Predictions Comparison');
  addImageToPDF(doc, path.join(visualizationDir, 'all_models_roc.png'), 'ROC Curve for All Models');

  const models = ['logistic_regression', 'random_forest', 'svm', 'knn'];
  models.forEach(model => {
    addImageToPDF(
      doc,
      path.join(visualizationDir, `${model}_cm.png`),
      `${formatModelName(model)} Confusion Matrix`
    );
  });

  // Recommendations
  doc.addPage();
  doc.fontSize(16).text('Health Recommendations', { underline: true });
  doc.moveDown(1);
  
  if (prediction.primary_prediction.prediction) {
    doc.list([
      'Consult a cardiologist at the earliest',
      'Engage in regular cardiovascular exercise',
      'Maintain a heart-healthy diet (low in sodium and cholesterol)',
      'Manage stress through relaxation techniques',
      'Monitor blood pressure regularly'
    ]);
  } else {
    doc.list([
      'Continue a balanced diet rich in omega-3 fatty acids',
      'Engage in 150 minutes of moderate exercise weekly',
      'Schedule annual health checkups',
      'Maintain healthy cholesterol levels',
      'Avoid smoking and limit alcohol'
    ]);
  }

  doc.end();

  return new Promise((resolve) => {
    stream.on('finish', () => {
      console.log(`Report saved to: ${reportPath}`);
      resolve({
        filename: filename,
        url: `/reports/${filename}`
      });
    });
  });
};

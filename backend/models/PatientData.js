const mongoose = require('mongoose');

const PatientDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicalInputs: {
    type: Object,
    required: true
  },
  predictions: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PatientData', PatientDataSchema);
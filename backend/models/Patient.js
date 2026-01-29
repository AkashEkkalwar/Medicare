const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: [true, 'Please provide age'],
    min: [0, 'Age must be positive'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Please provide gender'],
  },
  medicalHistory: {
    type: [String],
    default: [],
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Patient', patientSchema);

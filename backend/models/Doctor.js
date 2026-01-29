const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  specialty: {
    type: String,
    required: [true, 'Please provide specialty'],
    trim: true,
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience'],
    min: [0, 'Experience must be positive'],
  },
  availableSlots: [{
    type: Date,
  }],
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Doctor', doctorSchema);

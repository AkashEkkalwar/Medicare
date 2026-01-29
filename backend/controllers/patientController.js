const Patient = require('../models/Patient');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get patient profile
// @route   GET /api/patients/profile
// @access  Private (Patient)
const getProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id })
      .populate('userId', 'name email')
      .populate({
        path: 'appointments',
        populate: {
          path: 'doctorId',
          populate: { path: 'userId', select: 'name email' },
        },
      });

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/profile
// @access  Private (Patient)
const updateProfile = async (req, res) => {
  try {
    const { age, gender, medicalHistory } = req.body;
    const patient = await Patient.findOne({ userId: req.user._id });

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    if (age !== undefined) patient.age = age;
    if (gender) patient.gender = gender;
    if (medicalHistory) patient.medicalHistory = medicalHistory;

    await patient.save();
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient appointments
// @route   GET /api/patients/appointments
// @access  Private (Patient)
const getAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const appointments = await Appointment.find({ patientId: patient._id })
      .populate('doctorId', 'specialty experience')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient medical history
// @route   GET /api/patients/medical-history
// @access  Private (Patient)
const getMedicalHistory = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const appointments = await Appointment.find({ 
      patientId: patient._id,
      status: 'completed',
    })
      .populate('doctorId', 'specialty')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' },
      })
      .sort({ date: -1 })
      .select('date diagnosis prescription notes');

    res.json({
      medicalHistory: patient.medicalHistory,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAppointments,
  getMedicalHistory,
};

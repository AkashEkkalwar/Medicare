const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// @desc    Get doctor profile
// @route   GET /api/doctors/profile
// @access  Private (Doctor)
const getProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id })
      .populate('userId', 'name email')
      .populate({
        path: 'appointments',
        populate: {
          path: 'patientId',
          populate: { path: 'userId', select: 'name email' },
        },
      });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private (Doctor)
const updateProfile = async (req, res) => {
  try {
    const { specialty, experience, availableSlots } = req.body;
    const doctor = await Doctor.findOne({ userId: req.user._id });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    if (specialty) doctor.specialty = specialty;
    if (experience !== undefined) doctor.experience = experience;
    if (availableSlots) doctor.availableSlots = availableSlots;

    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor appointments
// @route   GET /api/doctors/appointments
// @access  Private (Doctor)
const getAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId', 'age gender')
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doctors by specialty
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const { specialty } = req.query;
    const query = specialty ? { specialty: new RegExp(specialty, 'i') } : {};
    
    const doctors = await Doctor.find(query)
      .populate('userId', 'name email')
      .select('-appointments');

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment (diagnosis, prescription)
// @route   PUT /api/doctors/appointments/:id
// @access  Private (Doctor)
const updateAppointment = async (req, res) => {
  try {
    const { diagnosis, prescription, notes, status } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctorId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify doctor owns this appointment
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (appointment.doctorId._id.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    if (diagnosis !== undefined) appointment.diagnosis = diagnosis;
    if (prescription !== undefined) appointment.prescription = prescription;
    if (notes !== undefined) appointment.notes = notes;
    if (status) appointment.status = status;

    await appointment.save();

    // Update patient medical history if appointment is completed
    if (status === 'completed' && diagnosis) {
      const patient = await Patient.findById(appointment.patientId);
      if (patient && !patient.medicalHistory.includes(diagnosis)) {
        patient.medicalHistory.push(diagnosis);
        await patient.save();
      }
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAppointments,
  getDoctors,
  updateAppointment,
};

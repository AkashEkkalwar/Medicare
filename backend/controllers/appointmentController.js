const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, notes } = req.body;

    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if appointment slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      date: new Date(date),
      time,
      notes,
      status: 'pending',
    });

    // Add appointment to patient and doctor
    patient.appointments.push(appointment._id);
    doctor.appointments.push(appointment._id);
    await patient.save();
    await doctor.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'age gender')
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email' },
      })
      .populate('doctorId', 'specialty experience')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email' },
      });

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient)
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify patient owns this appointment
    const patient = await Patient.findOne({ userId: req.user._id });
    if (appointment.patientId._id.toString() !== patient._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private (Admin)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'age gender')
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email' },
      })
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

// @desc    Update appointment status (Admin)
// @route   PUT /api/appointments/:id/status
// @access  Private (Admin)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'age gender')
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email' },
      })
      .populate('doctorId', 'specialty experience')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email' },
      });

    res.json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
};

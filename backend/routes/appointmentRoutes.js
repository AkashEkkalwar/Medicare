const express = require('express');
const router = express.Router();
const {
  createAppointment,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

// Patient routes
router.post('/', authorize('patient'), createAppointment);
router.put('/:id/cancel', authorize('patient'), cancelAppointment);

// Admin routes
router.get('/', authorize('admin'), getAllAppointments);
router.put('/:id/status', authorize('admin'), updateAppointmentStatus);

module.exports = router;

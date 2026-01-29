const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getAppointments,
  getDoctors,
  updateAppointment,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public route
router.get('/', getDoctors);

// Protected routes
router.use(protect);
router.get('/profile', authorize('doctor'), getProfile);
router.put('/profile', authorize('doctor'), updateProfile);
router.get('/appointments', authorize('doctor'), getAppointments);
router.put('/appointments/:id', authorize('doctor'), updateAppointment);

module.exports = router;

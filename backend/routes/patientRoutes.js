const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getAppointments,
  getMedicalHistory,
} = require('../controllers/patientController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(authorize('patient'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/appointments', getAppointments);
router.get('/medical-history', getMedicalHistory);

module.exports = router;

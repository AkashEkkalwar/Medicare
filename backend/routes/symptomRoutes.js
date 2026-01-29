const express = require('express');
const router = express.Router();
const { suggestSpecialty } = require('../utils/aiSymptomChecker');
const { protect } = require('../middlewares/authMiddleware');

// @desc    Check symptoms and suggest specialty
// @route   POST /api/symptoms/check
// @access  Private
router.post('/check', protect, (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms)) {
      return res.status(400).json({ message: 'Please provide an array of symptoms' });
    }

    const result = suggestSpecialty(symptoms);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

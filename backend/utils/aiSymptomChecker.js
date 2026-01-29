// Rule-based symptom checker to suggest appropriate specialty
const symptomSpecialtyMap = {
  // Cardiology symptoms
  'chest pain': 'Cardiology',
  'heart palpitations': 'Cardiology',
  'shortness of breath': 'Cardiology',
  'chest tightness': 'Cardiology',
  'irregular heartbeat': 'Cardiology',
  
  // Neurology symptoms
  'headache': 'Neurology',
  'migraine': 'Neurology',
  'seizures': 'Neurology',
  'dizziness': 'Neurology',
  'numbness': 'Neurology',
  'memory loss': 'Neurology',
  
  // Dermatology symptoms
  'rash': 'Dermatology',
  'skin irritation': 'Dermatology',
  'acne': 'Dermatology',
  'eczema': 'Dermatology',
  'psoriasis': 'Dermatology',
  
  // Orthopedics symptoms
  'joint pain': 'Orthopedics',
  'back pain': 'Orthopedics',
  'fracture': 'Orthopedics',
  'muscle pain': 'Orthopedics',
  'knee pain': 'Orthopedics',
  
  // Gastroenterology symptoms
  'stomach pain': 'Gastroenterology',
  'nausea': 'Gastroenterology',
  'vomiting': 'Gastroenterology',
  'diarrhea': 'Gastroenterology',
  'constipation': 'Gastroenterology',
  'abdominal pain': 'Gastroenterology',
  
  // Psychiatry symptoms
  'anxiety': 'Psychiatry',
  'depression': 'Psychiatry',
  'stress': 'Psychiatry',
  'mood swings': 'Psychiatry',
  
  // Ophthalmology symptoms
  'eye pain': 'Ophthalmology',
  'blurred vision': 'Ophthalmology',
  'eye redness': 'Ophthalmology',
  'vision problems': 'Ophthalmology',
  
  // ENT symptoms
  'ear pain': 'ENT',
  'hearing loss': 'ENT',
  'sore throat': 'ENT',
  'sinus problems': 'ENT',
  'nasal congestion': 'ENT',
  
  // General/Internal Medicine
  'fever': 'Internal Medicine',
  'fatigue': 'Internal Medicine',
  'cough': 'Internal Medicine',
  'cold': 'Internal Medicine',
};

const suggestSpecialty = (symptoms) => {
  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return {
      suggestedSpecialty: 'General Medicine',
      confidence: 'low',
      message: 'Please provide specific symptoms for better recommendations',
    };
  }

  const specialtyScores = {};
  const normalizedSymptoms = symptoms.map(s => s.toLowerCase().trim());

  // Score each specialty based on symptom matches
  normalizedSymptoms.forEach(symptom => {
    Object.keys(symptomSpecialtyMap).forEach(key => {
      if (symptom.includes(key) || key.includes(symptom)) {
        const specialty = symptomSpecialtyMap[key];
        specialtyScores[specialty] = (specialtyScores[specialty] || 0) + 1;
      }
    });
  });

  // Find the specialty with highest score
  const sortedSpecialties = Object.entries(specialtyScores)
    .sort((a, b) => b[1] - a[1]);

  if (sortedSpecialties.length === 0) {
    return {
      suggestedSpecialty: 'General Medicine',
      confidence: 'low',
      message: 'No specific specialty match found. Consult a general physician.',
    };
  }

  const [suggestedSpecialty, score] = sortedSpecialties[0];
  const totalSymptoms = symptoms.length;
  const confidence = score >= totalSymptoms * 0.5 ? 'high' : score >= totalSymptoms * 0.3 ? 'medium' : 'low';

  return {
    suggestedSpecialty,
    confidence,
    score,
    totalSymptoms,
    message: `Based on your symptoms, we recommend consulting a ${suggestedSpecialty} specialist.`,
  };
};

module.exports = { suggestSpecialty };

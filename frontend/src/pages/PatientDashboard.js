import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import AppointmentCard from '../components/AppointmentCard';

const PatientDashboard = () => {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [symptomResult, setSymptomResult] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    doctorId: '',
    date: '',
    time: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/patients/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchMedicalHistory = async () => {
    try {
      const response = await api.get('/patients/medical-history');
      setMedicalHistory(response.data);
    } catch (error) {
      console.error('Error fetching medical history:', error);
    }
  };

  const handleSymptomCheck = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    try {
      const symptomArray = symptoms.split(',').map(s => s.trim());
      const response = await api.post('/symptoms/check', { symptoms: symptomArray });
      setSymptomResult(response.data);
    } catch (error) {
      console.error('Error checking symptoms:', error);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.put(`/appointments/${appointmentId}/cancel`);
        fetchAppointments();
      } catch (error) {
        alert(error.response?.data?.message || 'Error cancelling appointment');
      }
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/appointments', bookingData);
      setShowBooking(false);
      setBookingData({ doctorId: '', date: '', time: '', notes: '' });
      fetchAppointments();
      alert('Appointment booked successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error booking appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name: <span className="font-semibold">{user?.name}</span></p>
              <p className="text-gray-600">Email: <span className="font-semibold">{user?.email}</span></p>
            </div>
            {profile && (
              <div>
                <p className="text-gray-600">Age: <span className="font-semibold">{profile.age}</span></p>
                <p className="text-gray-600">Gender: <span className="font-semibold capitalize">{profile.gender}</span></p>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 ${activeTab === 'appointments' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Appointments
          </button>
          <button
            onClick={() => {
              setActiveTab('symptom-checker');
              setSymptomResult(null);
            }}
            className={`px-4 py-2 ${activeTab === 'symptom-checker' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Symptom Checker
          </button>
          <button
            onClick={() => {
              setActiveTab('medical-history');
              fetchMedicalHistory();
            }}
            className={`px-4 py-2 ${activeTab === 'medical-history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Medical History
          </button>
        </div>

        {activeTab === 'appointments' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">My Appointments</h2>
              <button
                onClick={() => setShowBooking(!showBooking)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {showBooking ? 'Cancel' : 'Book Appointment'}
              </button>
            </div>

            {showBooking && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Book New Appointment</h3>
                <form onSubmit={handleBookAppointment}>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Doctor
                      </label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={bookingData.doctorId}
                        onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value })}
                      >
                        <option value="">Choose a doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor._id} value={doctor._id}>
                            Dr. {doctor.userId?.name} - {doctor.specialty}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={bookingData.time}
                        onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="3"
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Booking...' : 'Book Appointment'}
                  </button>
                </form>
              </div>
            )}

            <div>
              {appointments.length === 0 ? (
                <p className="text-gray-600">No appointments found.</p>
              ) : (
                appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    onCancel={handleCancelAppointment}
                    userRole="patient"
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'symptom-checker' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">AI Symptom Checker</h2>
            <p className="text-gray-600 mb-4">
              Enter your symptoms (comma-separated) to get a recommendation for the right specialist.
            </p>
            <form onSubmit={handleSymptomCheck} className="mb-4">
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                rows="4"
                placeholder="e.g., headache, dizziness, nausea"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Check Symptoms
              </button>
            </form>

            {symptomResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Recommendation</h3>
                <p className="text-gray-700 mb-2">{symptomResult.message}</p>
                <p className="text-sm text-gray-600">
                  Confidence: <span className="font-semibold capitalize">{symptomResult.confidence}</span>
                </p>
                {symptomResult.suggestedSpecialty && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Available {symptomResult.suggestedSpecialty} Doctors:</p>
                    <div className="space-y-2">
                      {doctors
                        .filter(d => d.specialty.toLowerCase() === symptomResult.suggestedSpecialty.toLowerCase())
                        .map((doctor) => (
                          <div key={doctor._id} className="bg-white p-3 rounded">
                            <p className="font-semibold">Dr. {doctor.userId?.name}</p>
                            <p className="text-sm text-gray-600">Experience: {doctor.experience} years</p>
                            <button
                              onClick={() => {
                                setBookingData({ ...bookingData, doctorId: doctor._id });
                                setActiveTab('appointments');
                                setShowBooking(true);
                              }}
                              className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              Book Appointment
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'medical-history' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Medical History</h2>
            {medicalHistory ? (
              <div>
                {medicalHistory.medicalHistory && medicalHistory.medicalHistory.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Recorded Medical History</h3>
                    <ul className="list-disc list-inside">
                      {medicalHistory.medicalHistory.map((item, index) => (
                        <li key={index} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Past Appointments</h3>
                  {medicalHistory.appointments && medicalHistory.appointments.length > 0 ? (
                    medicalHistory.appointments.map((appointment) => (
                      <div key={appointment._id} className="border-b pb-4 mb-4">
                        <p className="font-semibold">
                          Date: {new Date(appointment.date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">
                          Doctor: Dr. {appointment.doctorId?.userId?.name} ({appointment.doctorId?.specialty})
                        </p>
                        {appointment.diagnosis && (
                          <p className="text-green-700">
                            <strong>Diagnosis:</strong> {appointment.diagnosis}
                          </p>
                        )}
                        {appointment.prescription && (
                          <p className="text-blue-700">
                            <strong>Prescription:</strong> {appointment.prescription}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No completed appointments found.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Loading medical history...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import AppointmentCard from '../components/AppointmentCard';

const DoctorDashboard = () => {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updateData, setUpdateData] = useState({
    diagnosis: '',
    prescription: '',
    notes: '',
    status: 'confirmed',
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/doctors/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleUpdateAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setUpdateData({
      diagnosis: appointment.diagnosis || '',
      prescription: appointment.prescription || '',
      notes: appointment.notes || '',
      status: appointment.status,
    });
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    setLoading(true);
    try {
      await api.put(`/doctors/appointments/${selectedAppointment._id}`, updateData);
      setSelectedAppointment(null);
      fetchAppointments();
      alert('Appointment updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name: <span className="font-semibold">{user?.name}</span></p>
              <p className="text-gray-600">Email: <span className="font-semibold">{user?.email}</span></p>
            </div>
            {profile && (
              <div>
                <p className="text-gray-600">Specialty: <span className="font-semibold">{profile.specialty}</span></p>
                <p className="text-gray-600">Experience: <span className="font-semibold">{profile.experience} years</span></p>
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
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Update Profile
          </button>
        </div>

        {activeTab === 'appointments' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Appointments</h2>
            <div>
              {appointments.length === 0 ? (
                <p className="text-gray-600">No appointments found.</p>
              ) : (
                appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    onUpdate={handleUpdateAppointment}
                    userRole="doctor"
                  />
                ))
              )}
            </div>

            {selectedAppointment && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
                  <h3 className="text-xl font-semibold mb-4">
                    Update Appointment Record
                  </h3>
                  <form onSubmit={handleSubmitUpdate}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diagnosis
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows="3"
                        value={updateData.diagnosis}
                        onChange={(e) => setUpdateData({ ...updateData, diagnosis: e.target.value })}
                        placeholder="Enter diagnosis..."
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prescription
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows="3"
                        value={updateData.prescription}
                        onChange={(e) => setUpdateData({ ...updateData, prescription: e.target.value })}
                        placeholder="Enter prescription..."
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows="2"
                        value={updateData.notes}
                        onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                        placeholder="Additional notes..."
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={updateData.status}
                        onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Record'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedAppointment(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
            <p className="text-gray-600">Profile update functionality can be added here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;

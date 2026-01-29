import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import AppointmentCard from '../components/AppointmentCard';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const calculateStats = (appointments) => {
    const stats = {
      totalAppointments: appointments.length,
      pendingAppointments: appointments.filter(a => a.status === 'pending').length,
      confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length,
      completedAppointments: appointments.filter(a => a.status === 'completed').length,
    };
    setStats(stats);
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    setLoading(true);
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      fetchAppointments();
      setSelectedAppointment(null);
      alert('Appointment status updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating appointment status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}</h2>
          <p className="text-gray-600">Manage the healthcare platform</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm mb-2">Total Appointments</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalAppointments}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingAppointments}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm mb-2">Confirmed</h3>
            <p className="text-3xl font-bold text-green-600">{stats.confirmedAppointments}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm mb-2">Completed</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.completedAppointments}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">All Appointments</h2>
          <div>
            {appointments.length === 0 ? (
              <p className="text-gray-600">No appointments found.</p>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment._id} className="mb-4">
                  <AppointmentCard
                    appointment={appointment}
                    userRole="admin"
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                      disabled={loading || appointment.status === 'confirmed'}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                      disabled={loading || appointment.status === 'cancelled'}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                      disabled={loading || appointment.status === 'completed'}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition disabled:opacity-50"
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

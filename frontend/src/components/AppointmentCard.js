import React from 'react';
import { format } from 'date-fns';

const AppointmentCard = ({ appointment, onCancel, onUpdate, userRole }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">
              {userRole === 'patient'
                ? `Dr. ${appointment.doctorId?.userId?.name || 'N/A'}`
                : appointment.patientId?.userId?.name || 'N/A'}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                appointment.status
              )}`}
            >
              {appointment.status}
            </span>
          </div>
          <p className="text-gray-600 mb-1">
            {userRole === 'patient'
              ? `Specialty: ${appointment.doctorId?.specialty || 'N/A'}`
              : `Age: ${appointment.patientId?.age || 'N/A'}, Gender: ${appointment.patientId?.gender || 'N/A'}`}
          </p>
          <p className="text-gray-600 mb-1">
            Date: {appointment.date ? format(new Date(appointment.date), 'MMM dd, yyyy') : 'N/A'}
          </p>
          <p className="text-gray-600 mb-2">Time: {appointment.time}</p>
          {appointment.notes && (
            <p className="text-gray-700 mb-2">Notes: {appointment.notes}</p>
          )}
          {appointment.diagnosis && (
            <p className="text-green-700 mb-2">
              <strong>Diagnosis:</strong> {appointment.diagnosis}
            </p>
          )}
          {appointment.prescription && (
            <p className="text-blue-700">
              <strong>Prescription:</strong> {appointment.prescription}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2 ml-4">
          {userRole === 'patient' &&
            appointment.status !== 'completed' &&
            appointment.status !== 'cancelled' && (
              <button
                onClick={() => onCancel(appointment._id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Cancel
              </button>
            )}
          {userRole === 'doctor' && appointment.status === 'confirmed' && (
            <button
              onClick={() => onUpdate(appointment)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Update Record
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to Healthcare Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your trusted partner in healthcare management
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-2">For Patients</h3>
            <p className="text-gray-600 mb-4">
              Book appointments, access your medical records, and get AI-powered
              symptom analysis.
            </p>
            {!user && (
              <Link
                to="/register"
                className="text-blue-600 hover:underline"
              >
                Register as Patient →
              </Link>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-semibold mb-2">For Doctors</h3>
            <p className="text-gray-600 mb-4">
              Manage appointments, update patient records, and streamline your
              practice.
            </p>
            {!user && (
              <Link
                to="/register"
                className="text-blue-600 hover:underline"
              >
                Register as Doctor →
              </Link>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold mb-2">For Admins</h3>
            <p className="text-gray-600 mb-4">
              Oversee the platform, manage users, and view analytics.
            </p>
            {!user && (
              <Link
                to="/register"
                className="text-blue-600 hover:underline"
              >
                Register as Admin →
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h4 className="font-semibold">AI Symptom Checker</h4>
                <p className="text-gray-600">
                  Get instant recommendations for the right specialist
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h4 className="font-semibold">Smart Scheduling</h4>
                <p className="text-gray-600">
                  Book appointments with real-time availability
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h4 className="font-semibold">Electronic Health Records</h4>
                <p className="text-gray-600">
                  Access your complete medical history
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h4 className="font-semibold">Role-Based Dashboards</h4>
                <p className="text-gray-600">
                  Personalized experience for each user type
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

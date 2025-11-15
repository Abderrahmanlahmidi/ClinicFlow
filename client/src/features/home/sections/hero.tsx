import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiArrowRight, FiCheckCircle, FiUsers, FiClock, FiShield } from 'react-icons/fi';

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-normal mb-6">
              <FiShield className="w-4 h-4" />
              Trusted by Healthcare Professionals
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
              Your Health,
              <span className="block text-gray-900">Our Priority</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Experience seamless healthcare management with ClinicFlow. 
              Connect with doctors, manage appointments, and access your medical records securely.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-700">
                <FiCheckCircle className="w-5 h-5 text-gray-600" />
                <span className="text-base">Easy Appointment Scheduling</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FiCheckCircle className="w-5 h-5 text-gray-600" />
                <span className="text-base">Secure Patient Records</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FiCheckCircle className="w-5 h-5 text-gray-600" />
                <span className="text-base">Real-time Notifications</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/appointments"
                className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2 text-lg font-normal"
              >
                <FiCalendar className="w-5 h-5" />
                Book Appointment
                <FiArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/about"
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-lg font-normal"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Content - Medical Illustration */}
          <div className="relative">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-200">
                  <FiUsers className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                  <h3 className="font-normal text-gray-900">Patient Care</h3>
                  <p className="text-sm text-gray-600 mt-2">Comprehensive healthcare services</p>
                </div>
                <div className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-200">
                  <FiCalendar className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                  <h3 className="font-normal text-gray-900">Appointments</h3>
                  <p className="text-sm text-gray-600 mt-2">Easy online booking</p>
                </div>
                <div className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-200">
                  <FiClock className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                  <h3 className="font-normal text-gray-900">Quick Access</h3>
                  <p className="text-sm text-gray-600 mt-2">24/7 availability</p>
                </div>
                <div className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-200">
                  <FiShield className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                  <h3 className="font-normal text-gray-900">Secure Data</h3>
                  <p className="text-sm text-gray-600 mt-2">Protected medical records</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
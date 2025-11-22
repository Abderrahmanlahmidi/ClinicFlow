import React from "react";
import { FiArrowRight, FiCalendar, FiCheckCircle } from "react-icons/fi";

// Option 1: Import the image directly
import clinicImage from "../../../assets/images/cilinic.jpg";

export default function Hero() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${clinicImage})`,
      }}
    >
      {/* Rest of your component remains the same */}
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gray-900/90 "></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 px-4 py-2 rounded-full shadow-sm text-sm mb-6">
              <span className="w-3 h-3 rounded-full bg-lime-400"></span>
              <span className="text-gray-200">Modern Healthcare Platform</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-light text-white leading-tight mb-6">
              Smart Health Management
              <span className="block text-gray-300">Made Simple.</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-xl mb-8">
              Book appointments, track your wellness, and stay in control of
              your medical life—all in one simple, secure, and elegant platform.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-200">
                <FiCheckCircle className="text-lime-400 w-5 h-5" />
                <span>Easy online appointment booking</span>
              </div>

              <div className="flex items-center gap-3 text-gray-200">
                <FiCheckCircle className="text-lime-400 w-5 h-5" />
                <span>Real-time medical data tracking</span>
              </div>

              <div className="flex items-center gap-3 text-gray-200">
                <FiCheckCircle className="text-lime-400 w-5 h-5" />
                <span>Secure access to records</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-lime-400 text-gray-900 px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-lime-300 transition font-medium">
                <FiCalendar className="text-gray-900" />
                Book Appointment
                <FiArrowRight className="text-gray-900" />
              </button>

              <button className="border border-gray-600 text-gray-200 px-8 py-4 rounded-xl hover:bg-gray-800/50 transition">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Card */}
          <div className="backdrop-blur-xl bg-gray-800/70 shadow-xl border border-gray-700 rounded-2xl p-8">
            <h3 className="text-xl font-medium mb-4 text-white">Quick Stats</h3>
            <div className="space-y-6">
              <div className="flex justify-between">
                <span className="text-gray-300">Upcoming Appointments</span>
                <span className="font-semibold text-white">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Doctors Available</span>
                <span className="font-semibold text-white">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Health Score</span>
                <span className="font-semibold text-lime-400">92%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

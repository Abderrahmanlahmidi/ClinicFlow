import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaCheck, FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaGoogle, FaApple } from 'react-icons/fa';

export default function Register() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <motion.div 
        className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side - Branding & Info */}
        <motion.div 
          className="bg-white rounded-2xl p-8 flex flex-col justify-between border border-emerald-500"
          variants={itemVariants}
        >
          <div>
            <motion.div 
              className="flex items-center mb-10"
              variants={itemVariants}
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                <FaHeartbeat className="text-emerald-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">VitalCare Clinic</h1>
                <p className="text-emerald-600 text-sm">Your Health, Our Priority</p>
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold text-gray-800 mb-6"
              variants={itemVariants}
            >
              Join Our Healthcare Community
            </motion.h2>
            
            <motion.p 
              className="text-gray-600 mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Register today to access our comprehensive healthcare services, schedule appointments online, and manage your medical records securely.
            </motion.p>
            
            <motion.div 
              className="space-y-6 mb-10"
              variants={itemVariants}
            >
              <div className="flex items-start">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <FaCheck className="text-emerald-600 text-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Easy Appointment Booking</h3>
                  <p className="text-gray-600 text-sm">Schedule visits with specialists in just a few clicks</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <FaCheck className="text-emerald-600 text-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Digital Health Records</h3>
                  <p className="text-gray-600 text-sm">Access your medical history anytime, anywhere</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <FaCheck className="text-emerald-600 text-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Secure & Private</h3>
                  <p className="text-gray-600 text-sm">Your data is protected with industry-leading security</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="border-t border-gray-200 pt-6"
            variants={itemVariants}
          >
            <p className="text-gray-600 text-sm">
              Already have an account? 
              <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors ml-1">
                Sign In
              </a>
            </p>
          </motion.div>
        </motion.div>

        {/* Right Side - Registration Form */}
        <motion.div 
          className="bg-white rounded-2xl p-8 border border-emerald-500"
          variants={itemVariants}
        >
          <motion.div 
            className="text-center mb-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>
            <p className="text-gray-600 mt-2">Fill in your details to get started</p>
          </motion.div>
          
          <motion.form 
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Name Fields */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={itemVariants}
            >
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Enter your first name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={itemVariants}
            >
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
            </motion.div>

            {/* Password Fields */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={itemVariants}
            >
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required

                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div 
              className="flex items-start"
              variants={itemVariants}
            >
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
              </div>
              <label htmlFor="terms" className="ml-3 block text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                  Privacy Policy
                </a>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 border border-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:-translate-y-0.5"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Account
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div 
            className="mt-8 flex items-center"
            variants={itemVariants}
          >
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">Or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </motion.div>

          {/* Social Login Options */}
          <motion.div 
            className="mt-6 grid grid-cols-2 gap-3"
            variants={itemVariants}
          >
            <motion.button 
              className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors hover:border-emerald-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGoogle className="text-red-500 mr-2" />
              Google
            </motion.button>
            
            <motion.button 
              className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors hover:border-emerald-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaApple className="text-gray-800 mr-2" />
              Apple
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

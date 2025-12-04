import React from 'react';
import { motion } from 'framer-motion';
import {
  FiX,
  FiSave,
  FiRefreshCw,
  FiUser,
  FiCalendar,
  FiFileText,
  FiHeart,
  FiDroplet,
  FiThermometer,
  FiActivity,
  FiAlertCircle,
  FiBook,
  FiTrendingUp
} from "react-icons/fi";
import { useForm } from 'react-hook-form';

interface ConsultationFormData {
  userId: string;
  consultationDate: string;
  consultationReason: string;
  diagnosis: string;
  doctorNotes: string;
  allergies: string;
  bloodType: string;
  weight: number;
  width: number; // Changed from height to width
  bloodPressure: string;
  temperature: number;
  respiratoryRate: number;
  heartRate: number;
}

interface ConsultationFormProps {
  onSubmit: (data: ConsultationFormData) => void;
  isLoading: boolean;
  isEditing: boolean;
  onClose: () => void;
  users: Array<{ _id: string; firstName: string; lastName: string; email?: string }>;
  initialData?: Partial<ConsultationFormData>;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function ConsultationForm({ 
  onSubmit, 
  isLoading, 
  isEditing, 
  onClose, 
  users,
  initialData 
}: ConsultationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ConsultationFormData>({
    defaultValues: initialData || {}
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiFileText className="w-6 h-6 text-lime-400" />
                {isEditing ? 'Edit Consultation' : 'Add New Consultation'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Patient Selection */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <FiUser className="w-5 h-5 text-lime-400" />
                  Patient Information
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Patient *
                  </label>
                  <select
                    {...register('userId', { required: 'Patient selection is required' })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                  >
                    <option value="">Select a patient</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} {user.email ? `(${user.email})` : ''}
                      </option>
                    ))}
                  </select>
                  {errors.userId && (
                    <p className="mt-1 text-sm text-red-400">{errors.userId.message}</p>
                  )}
                </div>
              </div>

              {/* Consultation Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <FiCalendar className="w-5 h-5 text-blue-400" />
                      Consultation Details
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Consultation Date *
                        </label>
                        <input
                          type="date"
                          {...register('consultationDate', { required: 'Consultation date is required' })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        />
                        {errors.consultationDate && (
                          <p className="mt-1 text-sm text-red-400">{errors.consultationDate.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Consultation Reason *
                        </label>
                        <textarea
                          {...register('consultationReason', { required: 'Consultation reason is required' })}
                          rows={3}
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                          placeholder="Describe the reason for consultation..."
                        />
                        {errors.consultationReason && (
                          <p className="mt-1 text-sm text-red-400">{errors.consultationReason.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <FiAlertCircle className="w-5 h-5 text-red-400" />
                      Medical Information
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Allergies *
                        </label>
                        <input
                          {...register('allergies', { required: 'Allergies information is required' })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                          placeholder="List any allergies (e.g., Penicillin, Peanuts)..."
                        />
                        {errors.allergies && (
                          <p className="mt-1 text-sm text-red-400">{errors.allergies.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Blood Type *
                        </label>
                        <select
                          {...register('bloodType', { required: 'Blood type is required' })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        >
                          {BLOOD_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {errors.bloodType && (
                          <p className="mt-1 text-sm text-red-400">{errors.bloodType.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <FiActivity className="w-5 h-5 text-purple-400" />
                      Vital Signs *
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <FiTrendingUp className="inline w-4 h-4 mr-1" />
                          Weight (kg) *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          {...register('weight', { 
                            required: 'Weight is required',
                            min: { value: 0, message: 'Weight must be positive' },
                            max: { value: 500, message: 'Weight is too high' }
                          })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        />
                        {errors.weight && (
                          <p className="mt-1 text-sm text-red-400">{errors.weight.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <FiTrendingUp className="inline w-4 h-4 mr-1" />
                          Width (cm) * {/* Changed from Height to Width */}
                        </label>
                        <input
                          type="number"
                          {...register('width', { 
                            required: 'Width is required',
                            min: { value: 0, message: 'Width must be positive' },
                            max: { value: 300, message: 'Width is too high' }
                          })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        />
                        {errors.width && (
                          <p className="mt-1 text-sm text-red-400">{errors.width.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <FiDroplet className="inline w-4 h-4 mr-1 text-red-400" />
                          Blood Pressure *
                        </label>
                        <input
                          {...register('bloodPressure', { 
                            required: 'Blood pressure is required',
                            pattern: {
                              value: /^\d{2,3}\/\d{2,3}$/,
                              message: 'Format: 120/80'
                            }
                          })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                          placeholder="e.g., 120/80"
                        />
                        {errors.bloodPressure && (
                          <p className="mt-1 text-sm text-red-400">{errors.bloodPressure.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <FiThermometer className="inline w-4 h-4 mr-1 text-orange-400" />
                          Temperature (°C) *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          {...register('temperature', { 
                            required: 'Temperature is required',
                            min: { value: 30, message: 'Temperature too low' },
                            max: { value: 45, message: 'Temperature too high' }
                          })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        />
                        {errors.temperature && (
                          <p className="mt-1 text-sm text-red-400">{errors.temperature.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <FiActivity className="inline w-4 h-4 mr-1 text-blue-400" />
                          Respiratory Rate *
                        </label>
                        <input
                          type="number"
                          {...register('respiratoryRate', { 
                            required: 'Respiratory rate is required',
                            min: { value: 0, message: 'Must be positive' },
                            max: { value: 100, message: 'Value too high' }
                          })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        />
                        {errors.respiratoryRate && (
                          <p className="mt-1 text-sm text-red-400">{errors.respiratoryRate.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <FiHeart className="inline w-4 h-4 mr-1 text-green-400" />
                          Heart Rate (bpm) *
                        </label>
                        <input
                          type="number"
                          {...register('heartRate', { 
                            required: 'Heart rate is required',
                            min: { value: 0, message: 'Must be positive' },
                            max: { value: 200, message: 'Value too high' }
                          })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                        />
                        {errors.heartRate && (
                          <p className="mt-1 text-sm text-red-400">{errors.heartRate.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <FiBook className="w-5 h-5 text-yellow-400" />
                      Medical Notes *
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Diagnosis *
                        </label>
                        <textarea
                          {...register('diagnosis', { required: 'Diagnosis is required' })}
                          rows={3}
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                          placeholder="Enter diagnosis..."
                        />
                        {errors.diagnosis && (
                          <p className="mt-1 text-sm text-red-400">{errors.diagnosis.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Doctor's Notes *
                        </label>
                        <textarea
                          {...register('doctorNotes', { required: "Doctor's notes are required" })}
                          rows={3}
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                          placeholder="Additional notes and observations..."
                        />
                        {errors.doctorNotes && (
                          <p className="mt-1 text-sm text-red-400">{errors.doctorNotes.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-lime-400 text-gray-900 font-medium rounded-lg hover:bg-lime-300 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    {isEditing ? 'Update Consultation' : 'Create Consultation'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
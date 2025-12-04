import React from 'react';
import { FiEdit2, FiTrash2, FiEye, FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import type { Consultation } from '../types';
import { formatDate, formatTime, getPatientName, getDoctorName } from '../utils';
import { VITAL_SIGNS_LABELS } from '../constants';

interface ConsultationCardProps {
  consultation: Consultation;
  isDoctor: boolean;
  onEdit: (consultation: Consultation) => void;
  onDelete: (consultation: Consultation) => void;
  onViewDetails: (consultation: Consultation) => void;
}

export const ConsultationCard: React.FC<ConsultationCardProps> = ({
  consultation,
  isDoctor,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  const user = isDoctor ? 
    (typeof consultation.userId === 'object' ? consultation.userId : null) :
    (typeof consultation.doctorId === 'object' ? consultation.doctorId : null);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-xl hover:border-blue-400/30 transition-colors"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
              {user?.imageProfile ? (
                <img 
                  src={`http://localhost:8000${user.imageProfile}`} 
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {isDoctor ? getPatientName(consultation) : getDoctorName(consultation)}
              </p>
              <p className="text-xs text-gray-400">
                {isDoctor ? 'Patient' : 'Doctor'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDoctor && (
              <>
                <button
                  onClick={() => onEdit(consultation)}
                  className="p-1.5 text-gray-400 hover:text-lime-400 transition-colors"
                  title="Edit"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(consultation)}
                  className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => onViewDetails(consultation)}
              className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
              title="View Details"
            >
              <FiEye className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-300">
            <FiCalendar className="w-4 h-4 text-lime-400" />
            <span className="font-medium">{formatDate(consultation.consultationDate)}</span>
            <FiClock className="w-4 h-4 ml-2" />
            <span>{formatTime(consultation.consultationDate)}</span>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Reason</p>
            <p className="text-white text-sm line-clamp-2">{consultation.consultationReason}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Diagnosis</p>
            <p className="text-white text-sm line-clamp-2">{consultation.diagnosis}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800">
            <div className="text-center">
              <p className="text-xs text-gray-400">{VITAL_SIGNS_LABELS.bloodType}</p>
              <p className="text-sm font-medium text-white">{consultation.bloodType}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">{VITAL_SIGNS_LABELS.weight}</p>
              <p className="text-sm font-medium text-white">{consultation.weight} kg</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">{VITAL_SIGNS_LABELS.bloodPressure}</p>
              <p className="text-sm font-medium text-white">{consultation.bloodPressure}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">{VITAL_SIGNS_LABELS.heartRate}</p>
              <p className="text-sm font-medium text-white">{consultation.heartRate || consultation.hearRate} bpm</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
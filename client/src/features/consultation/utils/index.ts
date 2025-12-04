import type { Consultation } from '../Types/index';
import { DATE_FORMAT_OPTIONS, TIME_FORMAT_OPTIONS } from '../constants';

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString([], TIME_FORMAT_OPTIONS);
};

export const getPatientName = (consultation: Consultation): string => {
  if (consultation.userId && typeof consultation.userId === 'object') {
    return `${consultation.userId.firstName} ${consultation.userId.lastName}`;
  }
  return 'Unknown Patient';
};

export const getDoctorName = (consultation: Consultation): string => {
  if (consultation.doctorId && typeof consultation.doctorId === 'object') {
    return `Dr. ${consultation.doctorId.firstName} ${consultation.doctorId.lastName}`;
  }
  return 'Dr. Unknown';
};

export const getUserFromStorage = () => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role")?.toLowerCase() as 'doctor' | 'patient' | null;
  const isDoctor = role === 'doctor';
  const isPatient = role === 'patient';
  
  return { userId, role, isDoctor, isPatient };
};

export const prepareFormDataForBackend = (formData: any) => ({
  ...formData,
  height: formData.width 
});

export const prepareFormDataForFrontend = (consultation: Consultation) => ({
  ...consultation,
  width: consultation.height,
  userId: typeof consultation.userId === 'object' ? consultation.userId._id : consultation.userId
});
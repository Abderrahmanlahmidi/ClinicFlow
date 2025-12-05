export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Consultation {
  _id: string;
  consultationDate: string;
  consultationReason: string;
  diagnosis: string;
  doctorNotes: string;
  allergies: string;
  bloodType: string;
  weight: number;
  height: number;
  bloodPressure: string;
  temperature: number;
  respiratoryRate: string;
  heartRate: string;
  hearRate?: string;
  userId: string | User;
  doctorId: string | User;
}

export interface FormData {
  userId: string;
  consultationDate: string;
  consultationReason: string;
  diagnosis: string;
  doctorNotes: string;
  allergies: string;
  bloodType: string;
  weight: number;
  width: number;
  bloodPressure: string;
  temperature: number;
  respiratoryRate: string;
  heartRate: string;
}

export type Role = 'doctor' | 'patient' | null;
import { getDoctorAppointments } from '../../dashboard/pages/services/appointmentApi';
import { useQuery } from '@tanstack/react-query';
import type { User } from '../Types/index';

const doctorId = localStorage.getItem("userId");


export const MOCK_USERS: User[] = [
  { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
  { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
  { _id: '3', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
];

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};

export const TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit'
};

export const EMPTY_STATE_MESSAGES = {
  doctor: {
    title: "No consultations found",
    description: "Get started by adding your first consultation",
    buttonText: "Add Your First Consultation"
  },
  patient: {
    title: "No consultations found",
    description: "You don't have any consultations yet"
  }
} as const;

export const VITAL_SIGNS_LABELS = {
  bloodType: 'Blood Type',
  weight: 'Weight',
  bloodPressure: 'Blood Pressure',
  heartRate: 'Heart Rate',
  height: 'Height',
  temperature: 'Temperature',
  respiratoryRate: 'Respiratory Rate'
} as const;
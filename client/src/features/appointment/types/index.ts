export interface Role {
  _id?: string;
  name: string;
  description?: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  roleId: Role;
  specialityId?: { _id: string; name?: string } | string | null;
  imageProfile?: string;
}

export interface Speciality {
  _id: string;
  name: string;
  description?: string;
}

export interface Availability {
  _id: string;
  userId: { _id: string; firstName?: string; lastName?: string; email?: string; imageProfile?: string } | string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  dailyCapacity: number;
}

export interface SpecialitiesResponse {
  message?: string;
  specialities?: Speciality[];
}

export interface UsersResponse {
  users: User[];
}

export interface AvailabilitiesResponse {
  success?: boolean;
  availabilities?: Availability[];
}

export interface CreateAppointmentFormData {
  patientId?: string;
  doctorId?: string;
  specialityId?: string;
  date?: string;
}

export interface CreateAppointmentProps {
  isDoctor: boolean;
  isPatientLike: boolean;
  userId: string;
  userRole: string;
}
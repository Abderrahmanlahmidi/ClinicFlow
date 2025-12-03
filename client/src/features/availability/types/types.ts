export interface Availability {
  _id: string;
  userId: string;
  dayOfWeek: string | { value: string; label: string };
  startTime: string | { value: string; label: string };
  endTime: string | { value: string; label: string };
  dailyCapacity: number;
}

export interface AvailabilityFormData {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  dailyCapacity: number;
}

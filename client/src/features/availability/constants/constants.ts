export const DEFAULT_AVAILABILITY_FORM_VALUES = {
  dayOfWeek: "Monday",
  startTime: "09:00",
  endTime: "17:00",
  dailyCapacity: 10,
};

export const FORM_LABELS = {
  dayOfWeek: "Day of Week *",
  startTime: "Start Time *",
  endTime: "End Time *",
  dailyCapacity: "Daily Capacity *",
};

export const FORM_MESSAGES = {
  dayOfWeekRequired: "Day of week is required",
  startTimeRequired: "Start time is required",
  endTimeRequired: "End time is required",
  dailyCapacityRequired: "Daily capacity is required",
  capacityMin: "Minimum 1",
  capacityMax: "Maximum 100",
};

export const CAPACITY_CONSTRAINTS = {
  min: 1,
  max: 100,
};

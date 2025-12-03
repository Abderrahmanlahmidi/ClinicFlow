export const extractStringValue = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    if (value.value !== undefined) return value.value;
    if (value.label !== undefined) return value.label;
    if (value.name !== undefined) return value.name;
    if (value.text !== undefined) return value.text;
    if (Array.isArray(value)) return value.join(", ");
    return JSON.stringify(value);
  }
  return String(value);
};

export const formatTimeDisplay = (time: string): string => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${period}`;
};

export const calculateDuration = (start: string, end: string): string => {
  if (!start || !end) return "0 hours";
  const startTime = new Date(`2000-01-01T${start}`);
  const endTime = new Date(`2000-01-01T${end}`);
  const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  return `${hours.toFixed(1)} hours`;
};

export const getUniqueDays = (availabilities: any[]): string[] => {
  return Array.from(
    new Set(availabilities.map((a) => extractStringValue(a.dayOfWeek)))
  );
};

export const formatDayName = (day: string): string => {
  if (!day) return "";
  return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
};

export const getLocalStorageValues = (): { userId: string; userRole: string } => {
  if (typeof window === "undefined") {
    return { userId: "", userRole: "" };
  }
  
  const storedUserId = localStorage.getItem("userId") || "";
  const storedRoleRaw = localStorage.getItem("role") || "";
  
  return {
    userId: storedUserId,
    userRole: storedRoleRaw.toLowerCase()
  };
};
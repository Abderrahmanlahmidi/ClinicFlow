export const getStatusColor = (status) => {
  switch (status) {
    case "scheduled":
      return "bg-blue-500";
    case "in progress":
      return "bg-yellow-500";
    case "completed":
      return "bg-green-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

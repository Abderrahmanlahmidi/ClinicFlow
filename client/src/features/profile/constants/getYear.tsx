export const GetYear = (date) => {
  if (!date) return null;

  return new Date(date).getFullYear();
};

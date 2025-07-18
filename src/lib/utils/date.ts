export const formatDateKey = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const formatDateDisplay = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateLong = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export const isToday = (date: Date): boolean => {
  return date.toDateString() === new Date().toDateString();
};

export const generateId = (): string => {
  return Date.now().toString();
};

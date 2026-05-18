export const COMPLAINT_STATUS_ORDER = ["Submitted", "Under Review", "In Progress", "Resolved"];

export const getAllowedStatuses = (currentStatus) => {
  const currentIndex = COMPLAINT_STATUS_ORDER.indexOf(currentStatus);
  if (currentIndex === -1) return COMPLAINT_STATUS_ORDER;

  return COMPLAINT_STATUS_ORDER.slice(currentIndex);
};

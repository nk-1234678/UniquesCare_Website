export const COMPLAINT_STATUS_ORDER = ["Pending", "In Progress", "Resolved"];

export const getStatusIndex = (status) => COMPLAINT_STATUS_ORDER.indexOf(status);

export const canAdvanceStatus = (currentStatus, nextStatus) => {
  const currentIndex = getStatusIndex(currentStatus);
  const nextIndex = getStatusIndex(nextStatus);

  if (currentIndex === -1 || nextIndex === -1) return false;
  return nextIndex >= currentIndex;
};

import validator from "validator";

export const validateNotificationId = (id) => {
  if (!validator.isMongoId(String(id || ""))) {
    return {
      isValid: false,
      error: "Invalid notification id",
    };
  }

  return {
    isValid: true,
  };
};

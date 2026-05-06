import Notification from "../modals/Notification.js";
import { validateNotificationId } from "../validators/notificationValidators.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


// ✅ GET NOTIFICATIONS
export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return sendError(res, 401, "Unauthorized");

  const notifications = await Notification.find({
    recipients: { $in: [userId] },
    dismissedBy: { $ne: userId },
  })
    .sort({ sortAt: -1, createdAt: -1 })
    .lean();

  return sendSuccess(res, 200, {
    notifications: notifications.map((n) => ({ ...n, id: n._id })),
  });
});


// ✅ DISMISS NOTIFICATION
export const dismissNotification = asyncHandler(async (req, res) => {
  const idValidation = validateNotificationId(req.params.id);
  if (!idValidation.isValid) {
    return sendError(res, 400, idValidation.error);
  }

  const userId = req.user?._id;
  if (!userId) return sendError(res, 401, "Unauthorized");

  const notification = await Notification.findOne({
    _id: req.params.id,
    recipients: { $in: [userId] },
  });

  if (!notification) {
    return sendError(res, 404, "Notification not found");
  }

  const alreadyDismissed = notification.dismissedBy.some(
    (id) => id.toString() === userId.toString()
  );

  if (!alreadyDismissed) {
    notification.dismissedBy.push(userId);
    await notification.save();
  }

  return sendSuccess(res, 200, {
    message: "Notification dismissed successfully",
  });
});
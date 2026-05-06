import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },

    // ✅ Added: who should see this notification
    recipients: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
      default: [],
    },

    type: {
      type: String,
      enum: ["raised", "updated", "status_changed"], // ✅ added status_changed
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    actor: {
      type: String,
      required: true,
    },

    tone: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    sortAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // ✅ Changed: String[] → ObjectId[] for proper MongoDB comparisons
    dismissedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
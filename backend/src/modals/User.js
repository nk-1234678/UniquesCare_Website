import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true 
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ["student", "technician", "admin"],
      default: "student"
    },
    department: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    },
    profilePhoto: {
      type: String,
      default: ""
    },
    hasLoggedInBefore: {
      type: Boolean,
      default: false
    },
     academicYear: {
      type: String,
      default: "2025-26"
    },
    academicStartYear: {
      type: String,
      default: ""
    },
    academicEndYear: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  // Avoid double hashing when a bcrypt hash is already provided.
  if (/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(this.password)) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("User", userSchema);
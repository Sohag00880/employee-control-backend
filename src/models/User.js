const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
      index: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    consent: {
      camera: { type: Boolean, default: false },
      microphone: { type: Boolean, default: false },
      location: { type: Boolean, default: false },
      updatedAt: Date
    },
    presence: {
      online: { type: Boolean, default: false },
      lastSeenAt: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
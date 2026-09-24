const mongoose = require("mongoose");

const monitoringSessionSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    endedAt: Date,
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MonitoringSession", monitoringSessionSchema);
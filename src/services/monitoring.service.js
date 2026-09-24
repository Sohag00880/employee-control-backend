const MonitoringSession = require("../models/MonitoringSession");
const User = require("../models/User");

const startSession = async (adminId, employeeId) => {
  const employee = await User.findOne({
    _id: employeeId,
    role: "employee",
    isActive: true
  });

  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  const existing = await MonitoringSession.findOne({
    admin: adminId,
    employee: employeeId,
    status: "active"
  });

  if (existing) return existing;

  return MonitoringSession.create({
    admin: adminId,
    employee: employeeId
  });
};

const endSession = async (adminId, sessionId) => {
  return MonitoringSession.findOneAndUpdate(
    {
      _id: sessionId,
      admin: adminId,
      status: "active"
    },
    {
      $set: {
        status: "ended",
        endedAt: new Date()
      }
    },
    { new: true }
  );
};

const listSessions = async (adminId) => {
  return MonitoringSession.find({ admin: adminId })
    .populate("employee", "name username")
    .sort({ createdAt: -1 })
    .limit(100);
};

module.exports = { startSession, endSession, listSessions };
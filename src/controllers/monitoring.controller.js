const monitoringService = require("../services/monitoring.service");

const start = async (req, res, next) => {
  try {
    const session = await monitoringService.startSession(
      req.user._id,
      req.body.employeeId
    );

    res.status(201).json({
      success: true,
      data: { session }
    });
  } catch (error) {
    next(error);
  }
};

const end = async (req, res, next) => {
  try {
    const session = await monitoringService.endSession(
      req.user._id,
      req.params.sessionId
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Active monitoring session not found"
      });
    }

    res.json({ success: true, data: { session } });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const sessions = await monitoringService.listSessions(req.user._id);
    res.json({ success: true, data: { sessions } });
  } catch (error) {
    next(error);
  }
};

module.exports = { start, end, list };
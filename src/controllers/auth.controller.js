const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.json({
    success: true,
    data: { user: authService.sanitizeUser(req.user) }
  });
};

const logout = async (req, res, next) => {
  try {
    req.user.presence.online = false;
    req.user.presence.lastSeenAt = new Date();
    await req.user.save();

    res.json({
      success: true,
      message: "Logged out. Remove the JWT on the client."
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, me, logout };
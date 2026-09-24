const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  role: user.role,
  isActive: user.isActive,
  consent: user.consent,
  presence: user.presence
});

const register = async ({ name, username, password, role = "employee" }) => {
  if (!name || !username || !password) {
    const error = new Error("name, username and password are required");
    error.statusCode = 400;
    throw error;
  }

  if (!["admin", "employee"].includes(role)) {
    const error = new Error("Invalid role");
    error.statusCode = 400;
    throw error;
  }

  const exists = await User.findOne({ username: username.toLowerCase() });

  if (exists) {
    const error = new Error("Username already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    username: username.toLowerCase(),
    password: hashedPassword,
    role
  });

  return {
    user: sanitizeUser(user),
    token: generateToken(user)
  };
};

const login = async ({ username, password }) => {
  const user = await User.findOne({
    username: username.toLowerCase()
  }).select("+password");

  if (!user || !user.isActive) {
    const error = new Error("Invalid username or password");
    error.statusCode = 401;
    throw error;
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    const error = new Error("Invalid username or password");
    error.statusCode = 401;
    throw error;
  }

  user.presence.online = true;
  user.presence.lastSeenAt = new Date();
  await user.save();

  return {
    user: sanitizeUser(user),
    token: generateToken(user)
  };
};

module.exports = { register, login, sanitizeUser };
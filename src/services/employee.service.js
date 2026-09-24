const User = require("../models/User");

const listEmployees = async () => {
  return User.find({ role: "employee" })
    .select("-password")
    .sort({ createdAt: -1 });
};

const getEmployee = async (id) => {
  return User.findOne({ _id: id, role: "employee" }).select("-password");
};

const createEmployee = async ({ name, username, password }) => {
  const bcrypt = require("bcryptjs");

  if (!name || !username || !password) {
    const error = new Error("name, username and password are required");
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

  return User.create({
    name,
    username: username.toLowerCase(),
    password: hashedPassword,
    role: "employee"
  });
};

const updateEmployee = async (id, data) => {
  const allowed = {};

  if (typeof data.name === "string") allowed.name = data.name.trim();
  if (typeof data.isActive === "boolean") allowed.isActive = data.isActive;

  return User.findOneAndUpdate(
    { _id: id, role: "employee" },
    { $set: allowed },
    { new: true, runValidators: true }
  ).select("-password");
};

const deleteEmployee = async (id) => {
  return User.findOneAndDelete({ _id: id, role: "employee" });
};

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
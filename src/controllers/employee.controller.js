const employeeService = require("../services/employee.service");

const create = async (req, res, next) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    employee.password = undefined;

    res.status(201).json({
      success: true,
      data: { employee }
    });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const employees = await employeeService.listEmployees();
    res.json({ success: true, data: { employees } });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const employee = await employeeService.getEmployee(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.json({ success: true, data: { employee } });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const employee = await employeeService.updateEmployee(
      req.params.id,
      req.body
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.json({ success: true, data: { employee } });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const employee = await employeeService.deleteEmployee(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.json({
      success: true,
      message: "Employee deleted"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, list, getOne, update, remove };
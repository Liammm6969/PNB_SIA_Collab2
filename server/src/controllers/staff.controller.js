const StaffService = require("../services/staff.service.js");
const { StatusCodes } = require("http-status-codes");

// Staff login
exports.loginStaff = async (req, res) => {
  try {
    const { staffStringId, password } = req.body;
    const loginResult = await StaffService.loginStaff(staffStringId, password);
    res.cookie('refreshToken', loginResult.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    console.log(loginResult)
    res.status(StatusCodes.OK).json(loginResult);
  } catch (err) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: err.message });
  }
};

// Create a new staff member
exports.createStaff = async (req, res) => {
  try {
    const staff = await StaffService.createStaff(req.body);
    console.log(req.body);
    res.status(StatusCodes.CREATED).json(staff);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// Get staff member by ID
exports.getStaffById = async (req, res) => {
  try {
    const { staffId } = req.params;
    const staff = await StaffService.getStaffById(staffId);
    res.status(StatusCodes.OK).json(staff);
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
  }
};

// Update staff member by ID
exports.updateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const updatedStaff = await StaffService.updateStaff(staffId, req.body);
    res.status(StatusCodes.OK).json(updatedStaff);
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
  }
};

// Delete staff member by ID
exports.deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const result = await StaffService.deleteStaff(staffId);
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
  }
};

// Get all staff members
exports.getAllStaff = async (req, res) => {
  try {
    const staffList = await StaffService.getAllStaff();
    res.status(StatusCodes.OK).json(staffList);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Get staff members by department
exports.getStaffByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const staffList = await StaffService.getStaffByDepartment(department);
    res.status(StatusCodes.OK).json(staffList);
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
  }
};

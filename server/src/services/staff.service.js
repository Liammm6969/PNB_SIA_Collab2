const { Staff } = require("../models/index.js");
const { generateStaffAccessToken, generateStaffRefreshToken } = require('../lib/jwtmanager.js');
const { StaffNotFoundError, InvalidPasswordError, DuplicateStaffEmailError } = require('../errors/index.js');
const bcrypt = require('bcrypt');
class StaffService {
  constructor() {
    this.createStaff = this.createStaff.bind(this);
    this.getStaffById = this.getStaffById.bind(this);
    this.getAllStaff = this.getAllStaff.bind(this);
    this.updateStaff = this.updateStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.getStaffByDepartment = this.getStaffByDepartment.bind(this);
    this.loginStaff = this.loginStaff.bind(this);
  }

  async createStaff(data) {
    const staff = new Staff(data);

    const existingStaff = await Staff.findOne({ email: staff.email });
    if (existingStaff) throw new DuplicateStaffEmailError(`Staff with email ${staff.email} already exists`);

    const hashedPassword = await bcrypt.hash(staff.password, 10);
    staff.password = hashedPassword;

    await staff.save();
    return { message: `Staff with ID ${staff.staffId} created successfully`, staffId: staff.staffId };
  }

  async getStaffById(staffId) {
    const existingStaff = await Staff.findOne({ staffId: staffId });

    if (!existingStaff) throw new StaffNotFoundError(`Staff with ID ${staffId} not found`);


    return existingStaff;
  }

  async updateStaff(staffId, data) {
    const existingStaff = await Staff.findOne({ staffId: staffId });
    if (!existingStaff) throw new StaffNotFoundError(`Staff with ID ${staffId} not found`);

    const updatedStaff = await Staff.findOneAndUpdate({ staffId: staffId }, data, { new: true });

    return { message: `Staff with ID ${staffId} updated successfully`, staffId: staffId, updatedStaff };
  }

  async deleteStaff(staffId) {
    try {
      const existingStaff = await Staff.findOne({ staffId: staffId });

      if (!existingStaff) throw new StaffNotFoundError(`Staff with ID ${staffId} not found`);

      await Staff.findOneAndDelete({ staffId: staffId });

      return { message: `Staff with ID ${staffId} deleted successfully` };
    } catch (error) {
      throw error;
    }
  }

  async getAllStaff() {
    return await Staff.find();
  }
  async getStaffByDepartment(department) {
    const staff = await Staff.find({ department });
    if(!staff) throw new StaffNotFoundError(`No staff found in department ${department}`);
    return staff;
  }
  async loginStaff(staffStringId, password) {
    try {
      
      const staff = await Staff.findOne({ staffStringId });
      if (!staff) throw new StaffNotFoundError('Staff not found');

      const isMatch = await bcrypt.compare(password, staff.password);
      if (!isMatch) throw new InvalidPasswordError('Invalid password');
      const accessToken = generateStaffAccessToken({
        staffId: staff.staffId,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email
      });
      const refreshToken = generateStaffRefreshToken({
        staffId: staff.staffId,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email
      }); 
       
      return {
        message: 'Login Successful',
        staffId: staff.staffId,
        staffStringId: staff.staffStringId,
        department: staff.department,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        accessToken,
        refreshToken
      };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new StaffService();

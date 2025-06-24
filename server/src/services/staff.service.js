const { Staff } = require("../models/index.js");
const mongoose = require('mongoose');

class StaffService {
  constructor() {
    this.createStaff = this.createStaff.bind(this);
    this.getStaffById = this.getStaffById.bind(this);
    this.getAllStaff = this.getAllStaff.bind(this);    this.updateStaff = this.updateStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.getStaffByDepartment = this.getStaffByDepartment.bind(this);
  }

  async createStaff(data) {
    const staff = new Staff(data);

    const existingStaff = await Staff.findOne({ staffId: staff.staffId });
    if (existingStaff) throw new Error(`Staff with ID ${staff.staffId} already exists`);

    await staff.save()
    return { message: `Staff with ID ${staff.staffId} created successfully`, staffId: staff.staffId };
  }

  async getStaffById(staffId) {
    const existingStaff = await Staff.findOne({ staffId: staffId });

    if (!existingStaff) throw new Error(`Staff with ID ${staffId} not found`);


    return existingStaff;
  }

  async updateStaff(staffId, data) {
    const existingStaff = await Staff.findOne({ staffId: staffId });
    if (!existingStaff) throw new Error(`Staff with ID ${staffId} not found`);

    const updatedStaff = await Staff.findOneAndUpdate({ staffId: staffId }, data, { new: true });

    return { message: `Staff with ID ${staffId} updated successfully`, staffId: staffId, updatedStaff };
  }

  async deleteStaff(staffId) {
    try {
      const existingStaff = await Staff.findOne({ staffId: staffId });

      if (!existingStaff) throw new Error(`Staff with ID ${staffId} not found`);

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
    return staff;
  }
  async loginStaff(staffStringId, password) {
    try {
      const staff = await Staff.findOne({ staffStringId });
      if (!staff) throw new Error('Staff not found');
      
      // For now, simple password comparison (can be enhanced with bcrypt later)
      if (staff.password !== password) throw new Error('Invalid password');
      
      return { 
        message: 'Login Successful',
        staffId: staff.staffId,
        staffStringId: staff.staffStringId,
        department: staff.department,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email
      };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new StaffService();

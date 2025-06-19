const User = require("../models/user.model.js");
const bcrypt = require('bcrypt');
const { DuplicateUserEmailError, UserNotFoundError, InvalidPasswordError } = require('../errors');
class UserService {
  constructor() {
    this.registerUser = this.registerUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.listUsers = this.listUsers.bind(this);
  }

  async registerUser(userData) {
    try {
      const { fullName, email, password, address, gender, dateOfBirth, withdrawalMethods } = userData;
      console.log(userData)
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new DuplicateUserEmailError('Email already exists');
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        fullName,
        email,
        password: hashedPassword,
        address,
        gender,
        dateOfBirth,
        withdrawalMethods
      });
      await user.save();
      return { message: 'User registered', userId: user._id };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async loginUser(email, password) {
    try {
      const user = await User.findOne({ email });

      if (!user) throw new UserNotFoundError('User not found');

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) throw new InvalidPasswordError('Invalid password! Please try again.');

      return { message: 'Login successful', user: user.toObject() };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getUserProfile(id) {
    try {
      const user = await User.findById(id).select('-password');
      if (!user) throw new UserNotFoundError('User not found');
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async listUsers() {
    try {
      const users = await User.find().select('-password');
      return users;
    } catch (err) {
      throw new Error(err.message);
    }
  }

}

module.exports = new UserService();

const { User } = require("../models/index.js");
const bcrypt = require('bcrypt');
const { DuplicateUserEmailError, UserNotFoundError, InvalidPasswordError } = require('../errors');
const { sendOTPEmail } = require('../lib/mail');

const { generateAccessToken,
  generateRefreshToken } = require('../lib/jwtmanager.js');
const randomatic = require('randomatic');

function generateAccountNumber() {
  return `${randomatic('0', 3)}-${randomatic('0', 4)}-${randomatic('0', 3)}-${randomatic('0', 4)}`;
}

function generateOTP() {
  return randomatic('0', 6);
}

class UserService {
  constructor() {
    this.registerUser = this.registerUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.listUsers = this.listUsers.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
  }

  async registerUser(userData) {
    try {
      let { fullName, companyName, email, password, role, address, accountType, dateOfBirth, withdrawalMethods } = userData;
      console.log(userData)
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new DuplicateUserEmailError('Email already exists');
      const hashedPassword = await bcrypt.hash(password, 10);
      const randomAccountNumber = generateAccountNumber();

      const user = new User({
        fullName,
        companyName,
        email,
        password: hashedPassword,
        accountNumber: randomAccountNumber,
        role,
        address,
        dateOfBirth,
        withdrawalMethods,
        accountType
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
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); 
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
      await sendOTPEmail(user.email, otp);
      return { message: 'OTP sent to email. Please verify to complete login.', userId: user._id };
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

  async verifyOTP(email, otp) {
    try {
      const user = await User.findOne({ email });
      if (!user || !user.otp || !user.otpExpires) throw new Error('OTP not found. Please login again.');
      if (user.otp !== otp) throw new Error('Invalid OTP.');
      if (user.otpExpires < new Date()) throw new Error('OTP expired. Please login again.');
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      const accessToken = generateAccessToken({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
      const refreshToken = generateRefreshToken({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
      return { message: 'OTP verified. Login successful.', user: user.toObject(), accessToken, refreshToken };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = new UserService();

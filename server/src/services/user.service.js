const { User } = require("../models/index.js");
const bcrypt = require('bcrypt');
const { DuplicateUserEmailError, UserNotFoundError, InvalidPasswordError, OTPError, DuplicateCompanyNameError, DuplicateUserFullNameError } = require('../errors');
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
      const existingEmail = await User.findOne({ email });
      if (existingEmail) throw new DuplicateUserEmailError('Email already exists');


      // if (accountType === 'personal') {
      //   const existingFullName = await User.findOne({ fullName });
      //   if (existingFullName) throw new DuplicateUserFullNameError('Name already exists');
      // }

      // if (accountType === 'business') {
      //   const existingCompanyName = await User.findOne({ companyName });
      //   if (existingCompanyName) throw new DuplicateCompanyNameError('Company name already exists');
      // }
      const hashedPassword = await bcrypt.hash(password, 10);

      let randomAccountNumber;
      let ifAccountNumberExists;
      // do {
      //   randomAccountNumber = generateAccountNumber();
      //   ifAccountNumberExists = await User.findOne({ accountNumber: randomAccountNumber });
      // } while (ifAccountNumberExists);

      const user = new User({
        fullName,
        accountType,
        email,
        password: password,
      });

      await user.save();
      return { message: 'User registered', userId: user.userId };
    } catch (err) {
      throw err;
    }
  }

  async loginUser(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new UserNotFoundError('User not found');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new InvalidPasswordError('Invalid password! Please try again.');
      // const otp = generateOTP();
      // const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
      // user.otp = otp;
      // user.otpExpires = otpExpires;
      await user.save();
      // await sendOTPEmail(user.email, otp);
      return { message: 'OTP sent to email. Please verify to complete login.', userId: user.userId };
    } catch (err) {
      throw err;
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await User.find({ userId }).select('-password');
      if (!user) throw new UserNotFoundError('User not found');
      return user;
    } catch (err) {
      throw err;
    }
  }
  async listUsers() {
    try {
      const users = await User.find().select('-password');
      return users;
    } catch (err) {
      throw err;
    }
  }

  async verifyOTP(email, otp) {
    try {
      const user = await User.findOne({ email });
      if (!user || !user.otp || !user.otpExpires) throw new OTPError('OTP not found. Please login again.');
      if (user.otp !== otp) throw new Error('Invalid OTP.');
      if (user.otpExpires < new Date()) throw new OTPError('OTP expired. Please login again.');
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      const accessToken = generateAccessToken({
        id: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
      const refreshToken = generateRefreshToken({
        id: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
      return { message: 'OTP verified. Login successful.', user: user.toObject(), accessToken, refreshToken };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new UserService();

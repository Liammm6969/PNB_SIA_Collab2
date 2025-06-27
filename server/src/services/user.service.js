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

function generateTokens(user) {
  const accessToken = generateAccessToken({
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
  const refreshToken = generateRefreshToken({
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
  return { accessToken, refreshToken };
}

class UserService {
  constructor() {
    this.registerUser = this.registerUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.listUsers = this.listUsers.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.getUserByUserIdSeq = this.getUserByUserIdSeq.bind(this);

  }

  async registerUser(userData) {
    try {
      let { firstName, lastName, businessName, email, password, accountType, balance } = userData;

      console.log(userData)
      const existingEmail = await User.findOne({ email });
      if (existingEmail) throw new DuplicateUserEmailError('Email already exists');


      if (accountType === 'business' && businessName) {
        const existingBusinessName = await User.findOne({ businessName });
        if (existingBusinessName) throw new DuplicateCompanyNameError('Business name already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let randomAccountNumber;
      let ifAccountNumberExists;
      do {
        randomAccountNumber = generateAccountNumber();
        ifAccountNumberExists = await User.findOne({ accountNumber: randomAccountNumber });
      } while (ifAccountNumberExists);


      const userObj = {
        accountType,
        accountNumber: randomAccountNumber,
        email,
        password: hashedPassword,
        balance: balance
      };

      // Add appropriate name fields based on account type
      if (accountType === 'personal') {
        userObj.firstName = firstName;
        userObj.lastName = lastName;
      } else if (accountType === 'business') {
        userObj.businessName = businessName;
      }

      const user = new User(userObj);

      await user.save();

      return { message: 'User registered', savedUser: user.userId };
    } catch (err) {
      throw err;
    }
  }

  async loginUser(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new UserNotFoundError('User not found');
      if (user.isActive) throw new Error("User account is already in use.");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new InvalidPasswordError('Invalid password! Please try again.');

      if (!user.otp) {
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        await sendOTPEmail(user.email, otp);
        return { message: 'OTP sent to email. Please verify to complete login.' };
      }

      await user.save();

      const { accessToken, refreshToken } = generateTokens(user);

      return { message: 'OTP verified. Login successful.', user: user.toObject(), accessToken, refreshToken };
    } catch (err) {
      throw err;
    }
  } async getUserProfile(userId) {
    try {
      const user = await User.findOne({ userId }).select('-password');
      if (!user) throw new UserNotFoundError('User not found');
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getUserByUserIdSeq(userIdSeq) {
    try {
      const user = await User.findOne({ userIdSeq }).select('-password');
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

  async getRecentUsers(limit = 10) {
    try {
      const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(limit);
      return users;
    } catch (err) {
      throw err;
    }
  }

  async verifyOTP(email, otp) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new UserNotFoundError('User not found');
      if (!user.otp || !user.otpExpires) throw new OTPError('OTP not found. Please login again.');
      if (user.otp !== otp) throw new Error('Invalid OTP.');
      if (user.otpExpires < new Date()) throw new OTPError('OTP expired. Please login again.');
      user.otp = undefined;
      user.otpExpires = undefined;
      user.isActive = true;
      await user.save();

      const { accessToken, refreshToken } = generateTokens(user);

      return { message: 'OTP verified. Login successful.', user: user.toObject(), accessToken, refreshToken };
    } catch (err) {
      throw err;
    }
  }

  async logoutUser(userId) {
    try {
      const user = await User.findOne({ userId });
      if (!user) throw new UserNotFoundError('User not found');
      user.otp = undefined;
      user.otpExpires = undefined;
      user.isActive = false;
      await user.save();
      return { message: 'User logged out successfully' };
    } catch (err) {
      throw err;
    }
  }

}

module.exports = new UserService();

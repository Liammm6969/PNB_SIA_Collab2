const { UserService } = require('../services/index.js');
const { StatusCodes } = require("http-status-codes");
// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const user = await UserService.registerUser(req.body);
    res.status(StatusCodes.CREATED).json(user);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.loginUser(email, password);
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserService.getUserProfile(userId);
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    if (err.message === 'User not found') {
      res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  }
};

// List all users (for admin/testing)
exports.listUsers = async (req, res) => {
  try {
    const users = await UserService.listUsers();
    res.status(StatusCodes.OK).json(users);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(req.body)
    const result = await UserService.verifyOTP(email, otp);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(StatusCodes.OK).json({
      message: result.message,
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// Get user by userIdSeq
exports.getUserByUserIdSeq = async (req, res) => {
  try {
    const { userIdSeq } = req.params;
    const user = await UserService.getUserByUserIdSeq(parseInt(userIdSeq));
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await UserService.logoutUser(userId);
    res.clearCookie('refreshToken');
    res.status(StatusCodes.OK).json({ message: 'User logged out successfully' });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};
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
    const {message,user} = await UserService.loginUser(email, password);

    res.status(StatusCodes.OK).json({ message, user});
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserService.getUserProfile(userId);
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
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


exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const { message, user, accessToken, refreshToken } = await UserService.verifyOTP(email, otp);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({ message, user, accessToken });
  } catch (err) {
    res.status(401).json({ error: err.message });
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
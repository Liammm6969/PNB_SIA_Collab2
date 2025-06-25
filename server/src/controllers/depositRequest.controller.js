const { StatusCodes } = require('http-status-codes');
const DepositRequestService = require('../services/depositRequest.service');

// Create a new deposit request
// POST /api/deposit-requests
exports.createDepositRequest = async (req, res) => {
  try {
    const { userId, amount, note } = req.body;

    if (!userId || !amount) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'User ID and amount are required'
      });
    }

    const result = await DepositRequestService.createDepositRequest(userId, amount, note);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

// Get deposit requests for a specific user
// GET /api/deposit-requests/user/:userId
exports.getDepositRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit, status } = req.query;

    const requests = await DepositRequestService.getDepositRequestsByUser(
      userId, 
      parseInt(limit) || 10, 
      status
    );
    res.status(StatusCodes.OK).json(requests);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// Get all deposit requests (for Finance staff)
// GET /api/deposit-requests
exports.getAllDepositRequests = async (req, res) => {
  try {
    const { status, limit } = req.query;

    const requests = await DepositRequestService.getAllDepositRequests(
      status,
      parseInt(limit) || 50
    );
    res.status(StatusCodes.OK).json(requests);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// Get specific deposit request by ID
// GET /api/deposit-requests/:depositRequestId
exports.getDepositRequestById = async (req, res) => {
  try {
    const { depositRequestId } = req.params;

    const request = await DepositRequestService.getDepositRequestById(depositRequestId);
    res.status(StatusCodes.OK).json(request);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
  }
};

// Approve deposit request (Finance staff only)
// POST /api/deposit-requests/:depositRequestId/approve
exports.approveDepositRequest = async (req, res) => {
  try {
    const { depositRequestId } = req.params;
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Staff ID is required for approval'
      });
    }

    const result = await DepositRequestService.approveDepositRequest(depositRequestId, staffId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

// Reject deposit request (Finance staff only)
// POST /api/deposit-requests/:depositRequestId/reject
exports.rejectDepositRequest = async (req, res) => {
  try {
    const { depositRequestId } = req.params;
    const { staffId, rejectionReason } = req.body;

    if (!staffId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Staff ID is required for rejection'
      });
    }

    if (!rejectionReason || rejectionReason.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Rejection reason is required'
      });
    }

    const result = await DepositRequestService.rejectDepositRequest(
      depositRequestId, 
      staffId, 
      rejectionReason
    );
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

// Get deposit request statistics (Finance staff only)
// GET /api/deposit-requests/stats
exports.getDepositRequestStats = async (req, res) => {
  try {
    const stats = await DepositRequestService.getDepositRequestStats();
    res.status(StatusCodes.OK).json(stats);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = {
  createDepositRequest: exports.createDepositRequest,
  getDepositRequestsByUser: exports.getDepositRequestsByUser,
  getAllDepositRequests: exports.getAllDepositRequests,
  getDepositRequestById: exports.getDepositRequestById,
  approveDepositRequest: exports.approveDepositRequest,
  rejectDepositRequest: exports.rejectDepositRequest,
  getDepositRequestStats: exports.getDepositRequestStats
};

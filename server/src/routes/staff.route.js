const express = require('express');
const router = express.Router();
const staffController = require("../controllers/staff.controller.js");
const { ValidateRequestBodyMiddleware, ValidateRequestRouteParameterMiddleware, verifyAccessToken, PermissionMiddleware } = require('../middleware/index.js');
const { addStaffSchema,
  validateStaffIdSchema, } = require("../schema/index.js");


router.post('/login', staffController.loginStaff);

router.post('/', staffController.createStaff);

router.get('/:staffId', staffController.getStaffById);

router.put('/:staffId', staffController.updateStaff);

router.delete('/:staffId', staffController.deleteStaff);

router.get('/', staffController.getAllStaff);

router.get('/department/:department', staffController.getStaffByDepartment);

// Staff login route
router.post('/login', staffController.loginStaff);

module.exports = router;

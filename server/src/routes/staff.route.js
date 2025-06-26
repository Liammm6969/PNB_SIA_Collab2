const express = require('express');
const router = express.Router();
const staffController = require("../controllers/staff.controller.js");
const { ValidateRequestBodyMiddleware, ValidateRequestRouteParameterMiddleware, verifyAccessToken, PermissionMiddleware } = require('../middleware/index.js');
const { addStaffSchema,
  validateStaffIdSchema, } = require("../schema/index.js");



router.post('/login', staffController.loginStaff);

// router.use(verifyAccessToken);

router.post('/', ValidateRequestBodyMiddleware(addStaffSchema), staffController.createStaff);

router.get('/:staffId', ValidateRequestRouteParameterMiddleware(validateStaffIdSchema), staffController.getStaffById);

router.put('/:staffId', ValidateRequestRouteParameterMiddleware(validateStaffIdSchema), ValidateRequestBodyMiddleware(addStaffSchema), staffController.updateStaff);

router.delete('/:staffId', ValidateRequestRouteParameterMiddleware(validateStaffIdSchema), staffController.deleteStaff);

router.get('/', staffController.getAllStaff);

router.get('/department/:department', staffController.getStaffByDepartment);

module.exports = router;

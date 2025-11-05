const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/role.middleware');

router.get('/profile', auth, userController.getUserProfile); // Tất cả role đều có thể xem
router.put('/details', auth, userController.updateUserDetails); // Tất cả role đều có thể cập nhật

// Chỉ Student và Teacher có thể gửi yêu cầu
router.post('/teacher-request', auth, authorize('Student', 'Teacher'), userController.submitTeacherRequest);

// Chỉ Admin có thể xem và phê duyệt yêu cầu
router.get('/teacher-requests', auth, authorize('Admin'), userController.getTeacherRequests);
router.put('/teacher-request/:requestid', auth, authorize('Admin'), userController.updateTeacherRequest);

module.exports = router;
// src/api/v1/chapter.route.js
const express = require('express');
const router = express.Router();
const chapterController = require('../../controllers/chapter.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Route công khai (Public)
// Lấy tất cả chương của một khóa học
router.get('/course/:courseId', chapterController.handleGetChaptersByCourseId);

// Các route yêu cầu đăng nhập (và quyền Teacher/Admin)
router.use(authMiddleware);

// Tạo chương mới
router.post('/', chapterController.handleCreateChapter);

// Cập nhật chương
router.put('/:id', chapterController.handleUpdateChapter);

// Xóa chương
router.delete('/:id', chapterController.handleDeleteChapter);

module.exports = router;
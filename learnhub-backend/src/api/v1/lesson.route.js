// src/api/v1/lesson.route.js
const express = require('express');
const router = express.Router();
const lessonController = require('../../controllers/lesson.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Routes công khai (Public)
// Lấy tất cả bài học của 1 chương
router.get('/chapter/:chapterId', lessonController.handleGetLessonsByChapterId);

// Lấy chi tiết 1 bài học (cần đăng nhập và ghi danh mới xem được)
// Chúng ta sẽ thêm middleware kiểm tra ghi danh sau
router.get('/:id', authMiddleware, lessonController.handleGetLessonById);

// Các route yêu cầu đăng nhập (và quyền Teacher/Admin)
router.use(authMiddleware);

// Tạo bài học mới
router.post('/', lessonController.handleCreateLesson);

// Cập nhật bài học
router.put('/:id', lessonController.handleUpdateLesson);

// Xóa bài học
router.delete('/:id', lessonController.handleDeleteLesson);

module.exports = router;
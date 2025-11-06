// src/api/v1/course.route.js
const express = require("express");
const router = express.Router();
const courseController = require("../../controllers/course.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
// Chúng ta sẽ dùng authMiddleware, controller sẽ tự kiểm tra role Teacher/Admin

// === Các route CÔNG KHAI (Public) ===

// GET /api/v1/courses - Lấy danh sách khóa học (có lọc, phân trang)
router.get("/", courseController.handleGetAllCourses);

// GET /api/v1/courses/:id - Lấy chi tiết một khóa học
router.get("/:id", courseController.handleGetCourseDetailsById);

// Lấy danh sách khóa học theo categoryId
// GET /api/v1/courses/category/:categoryId
router.get(
  "/category/:categoryId",
  courseController.handleGetCoursesByCategory
);

// === Các route YÊU CẦU ĐĂNG NHẬP (Protected) ===
router.use(authMiddleware);

// POST /api/v1/courses - Tạo khóa học mới (Yêu cầu role Teacher/Admin)
router.post("/", courseController.handleCreateCourse);

// PUT /api/v1/courses/:id - Cập nhật khóa học (Yêu cầu chủ sở hữu hoặc Admin)
router.put("/:id", courseController.handleUpdateCourse);

// DELETE /api/v1/courses/:id - Xóa khóa học (Yêu cầu chủ sở hữu hoặc Admin)
router.delete("/:id", courseController.handleDeleteCourse);

module.exports = router;

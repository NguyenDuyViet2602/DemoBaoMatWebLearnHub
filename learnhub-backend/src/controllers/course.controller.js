// src/controllers/course.controller.js
const courseService = require('../services/course.service');

// [GET] /api/v1/courses
const handleGetAllCourses = async (req, res, next) => {
  try {
    // req.query chứa các tham số lọc như ?page=1&limit=10&categoryId=2
    const filters = req.query;
    const data = await courseService.getAllCourses(filters);
    res.status(200).json({
      message: 'Lấy danh sách khóa học thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
};

// [GET] /api/v1/courses/:id
const handleGetCourseDetailsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseDetailsById(Number(id));
    res.status(200).json({
      message: 'Lấy chi tiết khóa học thành công',
      data: course,
    });
  } catch (error) {
    // Nếu service ném lỗi "Không tìm thấy", trả về 404
    if (error.message === 'Không tìm thấy khóa học') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

// [POST] /api/v1/courses
const handleCreateCourse = async (req, res, next) => {
  try {
    const courseData = req.body;
    const teacherId = req.user.id; // Lấy từ authMiddleware

    // (Tạm thời) chỉ cho phép Teacher và Admin tạo khóa học
    if (req.user.role !== 'Teacher' && req.user.role !== 'Admin') {
         return res.status(403).json({ message: 'Chỉ có Giáo viên hoặc Admin mới được tạo khóa học.' });
    }

    const newCourse = await courseService.createCourse(courseData, teacherId);
    res.status(201).json({
      message: 'Tạo khóa học mới thành công, đang chờ duyệt',
      data: newCourse,
    });
  } catch (error) {
    next(error);
  }
};

// [PUT] /api/v1/courses/:id
const handleUpdateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = req.user; // Lấy từ authMiddleware

    const updatedCourse = await courseService.updateCourse(Number(id), updateData, user);
    res.status(200).json({
      message: 'Cập nhật khóa học thành công',
      data: updatedCourse,
    });
  } catch (error) {
    if (error.message.includes('Bạn không có quyền')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message === 'Không tìm thấy khóa học') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

// [DELETE] /api/v1/courses/:id
const handleDeleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user; // Lấy từ authMiddleware
    
    await courseService.deleteCourse(Number(id), user);
    res.status(200).json({
      message: 'Xóa khóa học thành công',
    });
  } catch (error) {
    if (error.message.includes('Bạn không có quyền')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message === 'Không tìm thấy khóa học') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = {
  handleGetAllCourses,
  handleGetCourseDetailsById,
  handleCreateCourse,
  handleUpdateCourse,
  handleDeleteCourse,
};
// src/services/course.service.js
const { Op } = require('sequelize');
const {
  courses,
  users,
  categories,
  chapters,
  lessons,
} = require('../models');

/**
 * Lấy danh sách tất cả khóa học với tùy chọn lọc và phân trang
 * @param {object} filters - Tùy chọn lọc (ví dụ: page, limit, categoryId, search)
 */
const getAllCourses = async (filters = {}) => {
  const {
    page = 1,
    limit = 10,
    categoryId,
    search,
    sortBy = 'createdat',
    sortOrder = 'DESC',
  } = filters;

  const offset = (page - 1) * limit;

  // Xây dựng điều kiện WHERE
  const whereCondition = {};
  if (categoryId) {
    whereCondition.categoryid = categoryId;
  }
  if (search) {
    whereCondition[Op.or] = [
      { coursename: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Truy vấn CSDL
  const { count, rows } = await courses.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: users,
        as: 'teacher', // Alias từ init-models.js
        attributes: ['userid', 'fullname', 'profilepicture'],
      },
      {
        model: categories,
        as: 'category', // Alias từ init-models.js
        attributes: ['categoryid', 'categoryname'],
      },
    ],
    offset,
    limit,
    order: [[sortBy, sortOrder]],
    distinct: true,
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    courses: rows,
  };
};

/**
 * Lấy chi tiết một khóa học
 * @param {number} courseId
 */
const getCourseDetailsById = async (courseId) => {
  const course = await courses.findByPk(courseId, {
    include: [
      {
        model: users,
        as: 'teacher',
        attributes: ['userid', 'fullname', 'profilepicture'],
      },
      {
        model: categories,
        as: 'category',
        attributes: ['categoryid', 'categoryname'],
      },
      {
        model: chapters,
        as: 'chapters',
        attributes: ['chapterid', 'title', 'sortorder'],
        separate: true, // Chạy truy vấn này riêng biệt để sắp xếp
        order: [['sortorder', 'ASC']],
        include: [
          {
            model: lessons,
            as: 'lessons',
            attributes: ['lessonid', 'title', 'videourl', 'sortorder'],
            separate: true, // Chạy truy vấn này riêng biệt để sắp xếp
            order: [['sortorder', 'ASC']],
          },
        ],
      },
      // Thêm các include khác nếu cần (ví dụ: reviews, enrollments count)
    ],
  });

  if (!course) {
    throw new Error('Không tìm thấy khóa học');
  }
  return course;
};

/**
 * Tạo một khóa học mới
 * @param {object} courseData - Dữ liệu khóa học
 * @param {number} teacherId - ID của giáo viên tạo khóa học
 */
const createCourse = async (courseData, teacherId) => {
  const newCourse = await courses.create({
    ...courseData,
    teacherid: teacherId, // Gán giáo viên cho khóa học
    status: 'Pending', // Mặc định khóa học mới cần admin duyệt
  });
  return newCourse;
};

/**
 * Cập nhật một khóa học (chỉ người tạo hoặc Admin)
 * @param {number} courseId
 * @param {object} updateData
 * @param {object} user - Người dùng thực hiện (từ middleware)
 */
const updateCourse = async (courseId, updateData, user) => {
  const course = await courses.findByPk(courseId);
  if (!course) {
    throw new Error('Không tìm thấy khóa học');
  }

  // Kiểm tra quyền: Chỉ Admin hoặc chủ sở hữu khóa học mới được sửa
  if (user.role !== 'Admin' && course.teacherid !== user.id) {
    throw new Error('Bạn không có quyền cập nhật khóa học này');
  }

  // Xóa các trường không được phép cập nhật (nếu có)
  delete updateData.teacherid;
  delete updateData.status; // Chỉ Admin mới được đổi status (sẽ làm ở API admin)

  const updatedCourse = await course.update(updateData);
  return updatedCourse;
};

/**
 * Xóa một khóa học (chỉ người tạo hoặc Admin)
 * @param {number} courseId
 * @param {object} user - Người dùng thực hiện (từ middleware)
 */
const deleteCourse = async (courseId, user) => {
  const course = await courses.findByPk(courseId);
  if (!course) {
    throw new Error('Không tìm thấy khóa học');
  }

  // Kiểm tra quyền: Chỉ Admin hoặc chủ sở hữu khóa học mới được xóa
  if (user.role !== 'Admin' && course.teacherid !== user.id) {
    throw new Error('Bạn không có quyền xóa khóa học này');
  }

  await course.destroy();
  return { message: 'Xóa khóa học thành công' };
};

module.exports = {
  getAllCourses,
  getCourseDetailsById,
  createCourse,
  updateCourse,
  deleteCourse,
};
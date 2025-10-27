// src/services/chapter.service.js
const { chapters, courses, users } = require('../models');

/**
 * Kiểm tra xem user có phải là chủ sở hữu khóa học hoặc Admin không
 */
const checkCourseOwnership = async (courseId, user) => {
  const course = await courses.findByPk(courseId);
  if (!course) {
    throw new Error('Không tìm thấy khóa học.');
  }
  if (user.role !== 'Admin' && course.teacherid !== user.id) {
    throw new Error('Bạn không có quyền chỉnh sửa khóa học này.');
  }
  return course;
};

/**
 * Tạo một chương mới cho khóa học
 * @param {number} courseId - ID Khóa học
 * * @param {object} chapterData - Dữ liệu chương (title, description, sortorder)
 * * @param {object} user - Người dùng (từ middleware)
 */
const createChapter = async (courseId, chapterData, user) => {
  await checkCourseOwnership(courseId, user);

  const newChapter = await chapters.create({
    ...chapterData,
    courseid: courseId,
  });
  return newChapter;
};

/**
 * Lấy tất cả chương của một khóa học
 * @param {number} courseId
 */
const getChaptersByCourseId = async (courseId) => {
  return await chapters.findAll({
    where: { courseid: courseId },
    order: [['sortorder', 'ASC']],
  });
};

/**
 * Cập nhật thông tin chương
 * @param {number} chapterId
 * * @param {object} updateData
 * * @param {object} user
 */
const updateChapter = async (chapterId, updateData, user) => {
  const chapter = await chapters.findByPk(chapterId);
  if (!chapter) {
    throw new Error('Không tìm thấy chương này.');
  }
  await checkCourseOwnership(chapter.courseid, user);

  return await chapter.update(updateData);
};

/**
 * Xóa một chương
 * @param {number} chapterId
 * * @param {object} user
 */
const deleteChapter = async (chapterId, user) => {
  const chapter = await chapters.findByPk(chapterId);
  if (!chapter) {
    throw new Error('Không tìm thấy chương này.');
  }
  await checkCourseOwnership(chapter.courseid, user);

  await chapter.destroy();
  return { message: 'Xóa chương thành công.' };
};

module.exports = {
  createChapter,
  getChaptersByCourseId,
  updateChapter,
  deleteChapter,
};
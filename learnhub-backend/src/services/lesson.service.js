// src/services/lesson.service.js
const { lessons, chapters, courses, users } = require('../models');

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
 * Tạo một bài học mới
 * @param {object} lessonData - Dữ liệu (chapterid, title, videourl, ...)
 * * @param {object} user - Người dùng (từ middleware)
 */
const createLesson = async (lessonData, user) => {
  const { chapterid } = lessonData;
  if (!chapterid) {
    throw new Error('Vui lòng cung cấp chapterid.');
  }

  // Kiểm tra quyền sở hữu thông qua chapter
  const chapter = await chapters.findByPk(chapterid);
  if (!chapter) {
    throw new Error('Không tìm thấy chương học.');
  }
  await checkCourseOwnership(chapter.courseid, user);

  const newLesson = await lessons.create({
    ...lessonData,
    courseid: chapter.courseid, // Lấy courseid từ chapter
  });
  return newLesson;
};

/**
 * Lấy tất cả bài học của một chương
 * @param {number} chapterId
 */
const getLessonsByChapterId = async (chapterId) => {
  return await lessons.findAll({
    where: { chapterid: chapterId },
    order: [['sortorder', 'ASC']],
  });
};

/**
 * Lấy chi tiết 1 bài học
 * @param {number} lessonId
 */
const getLessonById = async (lessonId) => {
  const lesson = await lessons.findByPk(lessonId);
  if (!lesson) {
    throw new Error('Không tìm thấy bài học.');
  }
  return lesson;
};

/**
 * Cập nhật bài học
 * @param {number} lessonId
 * * @param {object} updateData
 * * @param {object} user
 */
const updateLesson = async (lessonId, updateData, user) => {
  const lesson = await lessons.findByPk(lessonId);
  if (!lesson) {
    throw new Error('Không tìm thấy bài học.');
  }
  await checkCourseOwnership(lesson.courseid, user);

  return await lesson.update(updateData);
};

/**
 * Xóa một bài học
 * @param {number} lessonId
 * * @param {object} user
 */
const deleteLesson = async (lessonId, user) => {
  const lesson = await lessons.findByPk(lessonId);
  if (!lesson) {
    throw new Error('Không tìm thấy bài học.');
  }
  await checkCourseOwnership(lesson.courseid, user);

  await lesson.destroy();
  return { message: 'Xóa bài học thành công.' };
};

module.exports = {
  createLesson,
  getLessonsByChapterId,
  getLessonById,
  updateLesson,
  deleteLesson,
};
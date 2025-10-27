// src/api/v1/quiz.route.js
const express = require('express');
const router = express.Router();
const quizController = require('../../controllers/quiz.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Tất cả API quiz đều yêu cầu đăng nhập
router.use(authMiddleware);

// GET /api/v1/quizzes/:id
// Lấy chi tiết bài quiz (câu hỏi, lựa chọn)
router.get('/:id', quizController.handleGetQuizDetails);

// POST /api/v1/quizzes/:id/start
// Bắt đầu một phiên làm bài mới
router.post('/:id/start', quizController.handleStartSession);

// POST /api/v1/quizzes/submit/:sessionId
// Nộp bài và chấm điểm
router.post('/submit/:sessionId', quizController.handleSubmitQuiz);

module.exports = router;
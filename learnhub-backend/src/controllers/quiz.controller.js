// src/controllers/quiz.controller.js
const quizService = require('../services/quiz.service');

// [GET] /api/v1/quizzes/:id
const handleGetQuizDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;
    const data = await quizService.getQuizDetails(Number(id), studentId);
    res.status(200).json({
      message: 'Lấy chi tiết bài quiz thành công.',
      data,
    });
  } catch (error) {
    if (error.message.includes('Không tìm thấy')) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

// [POST] /api/v1/quizzes/:id/start
const handleStartSession = async (req, res, next) => {
  try {
    const { id } = req.params; // quizId
    const studentId = req.user.id;
    const session = await quizService.startQuizSession(Number(id), studentId);
    res.status(201).json({
      message: 'Bắt đầu phiên làm bài quiz thành công.',
      data: session, // Trả về sessionid
    });
  } catch (error) {
    if (error.message.includes('Không tìm thấy')) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

// [POST] /api/v1/quizzes/submit/:sessionId
const handleSubmitQuiz = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const studentId = req.user.id;
    const { answers } = req.body; // Mong đợi một mảng câu trả lời

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Vui lòng cung cấp câu trả lời.' });
    }

    const result = await quizService.submitQuiz(
      Number(sessionId),
      studentId,
      answers
    );
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('không hợp lệ')) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = {
  handleGetQuizDetails,
  handleStartSession,
  handleSubmitQuiz,
};
// src/services/quiz.service.js
const {
    sequelize,
    quizzes,
    quizquestions,
    quizoptions,
    quizsessions,
    quizanswers,
    enrollments,
  } = require('../models');
  
  /**
   * Lấy chi tiết một bài quiz (chỉ câu hỏi và lựa chọn)
   * @param {number} quizId - ID của bài quiz.
   * @param {number} studentId - ID của học viên.
   */
  const getQuizDetails = async (quizId, studentId) => {
    // 1. Lấy thông tin cơ bản của quiz
    const quizInfo = await quizzes.findByPk(quizId, {
      attributes: [
        'quizid',
        'lessonid',
        'title',
        'timelimit',
        'maxattempts',
      ],
    });
  
    if (!quizInfo) {
      throw new Error('Không tìm thấy bài quiz.');
    }
  
    // 2. Kiểm tra xem học viên đã ghi danh vào khóa học chứa bài quiz này chưa
    // (Giả định rằng lesson đã được liên kết với course)
    // Bạn cần đảm bảo model `lessons` có association 'course'
    // Vì model `quizzes` liên kết với `lessons`, chúng ta cần tìm `courseid` từ `lessonid`
    // (Phần này sẽ cần model `lessons` - tạm thời bỏ qua để đơn giản hóa)
    /*
    const lesson = await lessons.findByPk(quizInfo.lessonid);
    const enrollment = await enrollments.findOne({ 
      where: { studentid: studentId, courseid: lesson.courseid }
    });
    if (!enrollment) {
      throw new Error('Bạn phải ghi danh vào khóa học để làm bài quiz này.');
    }
    */
  
    // 3. Lấy danh sách câu hỏi và các lựa chọn
    const questions = await quizquestions.findAll({
      where: { quizid: quizId },
      attributes: ['questionid', 'questiontext', 'explanation'], // Không lấy correctoptionid
      include: [
        {
          model: quizoptions,
          as: 'quizoptions',
          attributes: ['optionid', 'optiontext'], // Không lấy iscorrect
        },
      ],
    });
  
    return { quizInfo, questions };
  };
  
  /**
   * Bắt đầu một phiên làm bài quiz
   * @param {number} quizId - ID của bài quiz.
   * @param {number} studentId - ID của học viên.
   */
  const startQuizSession = async (quizId, studentId) => {
    const quizInfo = await quizzes.findByPk(quizId);
    if (!quizInfo) {
      throw new Error('Không tìm thấy bài quiz.');
    }
    
    // (Tạm thời) logic kiểm tra số lần thử (attempts) ...
    
    // Tạo một phiên làm bài mới
    const newSession = await quizsessions.create({
      quizid: quizId,
      studentid: studentId,
      starttime: new Date(), // Giả sử starttime là bắt buộc
    });
  
    return newSession;
  };
  
  /**
   * Nộp bài và chấm điểm
   * @param {number} sessionId - ID của phiên làm bài.
   * @param {number} studentId - ID của học viên (để bảo mật).
   * @param {Array<object>} answers - Mảng các câu trả lời, ví dụ: [{ questionId: 1, selectedOptionId: 3 }, ...]
   */
  const submitQuiz = async (sessionId, studentId, answers) => {
    const t = await sequelize.transaction();
    try {
      // 1. Lấy thông tin phiên làm bài
      const session = await quizsessions.findOne({
        where: {
          sessionid: sessionId,
          studentid: studentId,
          submittedat: null, // Đảm bảo chưa nộp
        },
        transaction: t,
      });
  
      if (!session) {
        throw new Error('Phiên làm bài không hợp lệ hoặc đã được nộp.');
      }
  
      // 2. Lấy danh sách câu hỏi và đáp án ĐÚNG của bài quiz này
      const correctAnswers = await quizquestions.findAll({
        where: { quizid: session.quizid },
        attributes: ['questionid', 'correctoptionid'],
        raw: true, // Chỉ lấy dữ liệu thô
        transaction: t,
      });
  
      // Chuyển thành dạng map để tra cứu nhanh: { questionId: correctOptionId }
      const answerKey = correctAnswers.reduce((acc, q) => {
        acc[q.questionid] = q.correctoptionid;
        return acc;
      }, {});
  
      let score = 0;
      const answerRecords = []; // Mảng để bulkCreate vào CSDL
  
      // 3. Duyệt qua câu trả lời của học viên để chấm điểm
      for (const answer of answers) {
        const isCorrect =
          answerKey[answer.questionId] === answer.selectedOptionId;
        if (isCorrect) {
          score++;
        }
  
        answerRecords.push({
          sessionid: sessionId,
          questionid: answer.questionId,
          selectedoptionid: answer.selectedOptionId,
          iscorrect: isCorrect,
        });
      }
  
      // 4. Lưu tất cả câu trả lời vào CSDL
      await quizanswers.bulkCreate(answerRecords, { transaction: t });
  
      // 5. Cập nhật điểm và trạng thái cho phiên làm bài
      const finalScore = (score / correctAnswers.length) * 100; // Tính điểm %
      await session.update(
        {
          submittedat: new Date(),
          score: finalScore,
          endtime: new Date(), // (Tạm thời)
        },
        { transaction: t }
      );
  
      await t.commit();
      return {
        message: 'Nộp bài thành công!',
        sessionId,
        score: finalScore,
        totalCorrect: score,
        totalQuestions: correctAnswers.length,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(`Lỗi khi nộp bài: ${error.message}`);
    }
  };
  
  module.exports = {
    getQuizDetails,
    startQuizSession,
    submitQuiz,
  };
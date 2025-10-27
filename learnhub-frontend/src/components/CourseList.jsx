// src/components/CourseList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/v1/courses?limit=6'); // Lấy 6 khóa học
        setCourses(response.data.data.courses);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải khóa học: ' + err.message);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="text-center py-10">Đang tải khóa học...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">Khám phá các khóa học</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course.courseid} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Ảnh khóa học sẽ thêm sau */}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{course.coursename}</h3>
              {/* Tên giáo viên sẽ thêm sau */}
              <p className="text-gray-700 mb-4">{course.description ? course.description.substring(0, 100) + '...' : 'Không có mô tả'}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">
                  {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()} VND`}
                </span>
                <a href="#" className="text-blue-600 hover:underline">Xem chi tiết</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseList;
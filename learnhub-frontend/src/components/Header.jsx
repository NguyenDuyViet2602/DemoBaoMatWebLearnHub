// src/components/Header.jsx
import React from 'react';

function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">LearnHub</div>
        <div>
          {/* Menu items sẽ thêm sau */}
          <a href="#" className="text-gray-800 hover:text-blue-600 px-3">Home</a>
          <a href="#" className="text-gray-800 hover:text-blue-600 px-3">Courses</a>
          {/* Nút Login/Signup sẽ thêm sau */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-4">
            Login
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
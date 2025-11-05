// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CourseDetail from './pages/CourseDetail';
import SearchPage from './pages/SearchPage';
import Profile from './pages/Profile';
import Teacher from './pages/Teacher';
import Admin from './pages/Admin';
import withAuthorization from './hoc/withAuthorization';

const ProtectedProfile = withAuthorization(['Student', 'Teacher', 'Admin'])(Profile);
const ProtectedTeacher = withAuthorization(['Teacher'])(Teacher);
const ProtectedAdmin = withAuthorization(['Admin'])(Admin);

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProtectedProfile />} />
            <Route path="/teacher" element={<ProtectedTeacher />} />
            <Route path="/admin" element={<ProtectedAdmin />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
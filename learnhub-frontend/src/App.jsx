import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/HomePage';
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
      <Header />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProtectedProfile />} />
          <Route path="/teacher" element={<ProtectedTeacher />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
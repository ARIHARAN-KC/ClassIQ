import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home.jsx";
import Hero from "./pages/Home/Hero.jsx";
import Classroom from "./pages/Classroom";
import Auth from "./pages/Auth/Auth.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import AssignmentUpload from "./pages/AssignmentUpload.jsx";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard.jsx";
import Login from "./pages/Auth/Login.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hero" element={<Hero />} />
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/assignment-upload" element={<AssignmentUpload />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

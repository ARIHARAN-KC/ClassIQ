import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import TeacherDashboard from "./pages/Dashboards/TeacherDashboard";
import StudentDashboard from "./pages/Dashboards/StudentDashboard";
import ForgotPassword from "./pages/Passwords/ForgotPassword";
import ResetPassword from "./pages/Passwords/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./pages/Profile/UserProfile";
import ClassDetails from "./pages/Teachers/ClassDetails";
import UpdateClass from "./pages/Teachers/UpdateClass";
import AssignmentDetails from "./pages/Teachers/AssignmentDetails";
import UpdateAssignment from "./pages/Teachers/UpdateAssignment";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/classdetails/:id" element={<ClassDetails />} />
        <Route path="/updateclass/:id" element={<UpdateClass />} />
        <Route path="/assignmentdetails/:assignmentId" element={<AssignmentDetails />} />
        <Route path="/updateassignment/:assignmentId" element={<UpdateAssignment />} />

        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
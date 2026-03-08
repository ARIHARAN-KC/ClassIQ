import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import TeacherDashboard from "./pages/Dashboards/TeacherDashboard";
import StudentDashboard from "./pages/Dashboards/StudentDashboard";
import ForgotPassword from "./pages/Passwords/ForgotPassword";
import ResetPassword from "./pages/Passwords/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./pages/Profile/UserProfile";
import ClassDetails from "./pages/Teachers/Classes/ClassDetails";
import UpdateClass from "./pages/Teachers/Classes/UpdateClass";
import AssignmentDetails from "./pages/Teachers/Assignments/AssignmentDetails";
import UpdateAssignment from "./pages/Teachers/Assignments/UpdateAssignment";
import JoinedClassesPage from "./pages/Students/JoinedClasses";
import AssignmentSubmissionsPage from "./pages/Teachers/Assignments/StudentsAssignments";

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
        <Route path="/joined-classes" element={<JoinedClassesPage />} />
        <Route path="/assignment-submissions/:assignmentId" element={<AssignmentSubmissionsPage />} />

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
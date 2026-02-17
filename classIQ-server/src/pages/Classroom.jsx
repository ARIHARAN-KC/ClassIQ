import { useState } from "react";
import { motion } from "framer-motion";
import ClassroomSignin from "../components/ClassroomSignin";
import Navbar from "./Navbar";

const Classroom = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Mock authentication check - replace with real auth logic
  const handleAuthentication = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen py-12 px-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Classroom
              </h1>
              <p className="text-gray-600">
                Sign in to join your class or enter a class code to get started
              </p>
            </div>
            
            <ClassroomSignin />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Or{' '}
                <a href="/auth" className="font-medium text-blue-600 hover:text-blue-500">
                  create a full account
                </a>
                {' '}for more features
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow p-6 mb-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">
                📚 Classroom
              </h1>
              <p className="text-gray-500 mt-1">
                Welcome to your smart AI-powered classroom
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="font-semibold text-gray-900">{user?.name || 'Student'}</p>
            </div>
          </div>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT – VIDEO / LIVE CLASS */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2 bg-white rounded-xl shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              🎥 Live Class
            </h2>

            {/* Video Placeholder */}
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              Live Video Stream
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4 mt-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                🎤 Mute
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                📹 Camera
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                ✋ Raise Hand
              </button>
            </div>
          </motion.div>

          {/* RIGHT – INFO PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              📊 Class Info
            </h2>

            <ul className="space-y-3 text-gray-600">
              <li>👩‍🏫 Teacher: Mr. Kumar</li>
              <li>📘 Subject: Computer Science</li>
              <li>🕒 Time: 10:00 AM – 11:00 AM</li>
              <li>👥 Students: 45</li>
              <li>📍 Class Code: ABC123</li>
            </ul>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                  📝 View Assignments
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                  📊 Check Grades
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                  💬 Class Chat
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white rounded-xl shadow p-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            📝 Today's Activities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
              <h3 className="font-semibold text-blue-800">📌 Assignment Discussion</h3>
              <p className="text-sm text-blue-600 mt-1">Review homework solutions</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
              <h3 className="font-semibold text-green-800">🤖 AI Doubt Solver</h3>
              <p className="text-sm text-green-600 mt-1">Get instant help with questions</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
              <h3 className="font-semibold text-purple-800">📈 Performance Review</h3>
              <p className="text-sm text-purple-600 mt-1">Track your progress</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Classroom;
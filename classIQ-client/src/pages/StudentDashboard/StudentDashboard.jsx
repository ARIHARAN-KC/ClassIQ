import React from "react";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🎓 Student Dashboard</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700">
          Logout
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Courses" value="6" />
        <StatCard title="Assignments" value="12" />
        <StatCard title="Attendance" value="92%" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Courses */}
        <div className="md:col-span-2 bg-white rounded-2xl p-5 shadow">
          <h2 className="text-lg font-semibold mb-4">My Courses</h2>
          <ul className="space-y-3">
            <CourseItem name="Mathematics" instructor="Dr. Smith" />
            <CourseItem name="Computer Science" instructor="Prof. Lee" />
            <CourseItem name="Physics" instructor="Dr. Brown" />
          </ul>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-2xl p-5 shadow">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
              JD
            </div>
            <div>
              <p className="font-semibold">John Doe</p>
              <p className="text-sm text-gray-500">Computer Science</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function CourseItem({ name, instructor }) {
  return (
    <li className="flex items-center justify-between border p-3 rounded-xl">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">{instructor}</p>
      </div>
      <button className="text-blue-600 text-sm hover:underline">View</button>
    </li>
  );
}

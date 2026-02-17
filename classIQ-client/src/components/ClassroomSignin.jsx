import { useState } from 'react';
import { motion } from 'framer-motion';

const ClassroomSignin = () => {
  const [classCode, setClassCode] = useState('');
  const [studentName, setStudentName] = useState('');

  const handleQuickJoin = (e) => {
    e.preventDefault();
    console.log('Quick join attempt:', { classCode, studentName });
    // Add quick join logic here
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Join Classroom</h3>
        <p className="text-sm text-gray-500">Enter your class code to join quickly</p>
      </div>

      <form onSubmit={handleQuickJoin} className="space-y-4">
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <input
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label htmlFor="classCode" className="block text-sm font-medium text-gray-700">
            Class Code
          </label>
          <input
            type="text"
            id="classCode"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center text-lg font-mono tracking-wider"
            placeholder="ABC123"
            maxLength={6}
            required
          />
          <p className="mt-1 text-xs text-gray-500">Ask your teacher for the class code</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Join Classroom
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Need an account?{' '}
          <a href="/auth" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up here
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default ClassroomSignin;
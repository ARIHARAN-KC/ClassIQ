import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const redirectByRole = (role) => {
    if (role === "student") navigate("/student-dashboard");
    else if (role === "teacher") navigate("/teacher-dashboard");
    else if (role === "admin") navigate("/admin-dashboard");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Signup data:", formData);

    // temporary role-based redirect
    redirectByRole(formData.role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Abstract geometric patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large circles */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-800 rounded-full opacity-10"></div>
        
        {/* Dots pattern */}
        <div className="absolute top-20 left-20 grid grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-gray-400 rounded-full opacity-20"></div>
          ))}
        </div>
        
        {/* Lines */}
        <div className="absolute top-1/4 right-1/4 w-64 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent rotate-45 opacity-20"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent -rotate-45 opacity-20"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, gray 1px, transparent 0)',
          backgroundSize: '40px 40px',
          opacity: 0.1
        }}></div>
      </div>

      {/* Main container with glass morphism effect */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full relative z-10"
      >
        {/* Card with white and black theme */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          
          {/* Decorative header bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="h-1 w-16 bg-black rounded-full"></div>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </div>
          </div>

          {/* Header section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome
              </h2>
              <div className="flex items-center justify-center space-x-2">
                <div className="h-px w-12 bg-black"></div>
                <p className="text-gray-600 font-medium">Create Account</p>
                <div className="h-px w-12 bg-black"></div>
              </div>
            </motion.div>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Form fields with enhanced styling */}
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  name="fullName"
                  placeholder="John Doe"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors duration-300 bg-gray-50"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors duration-300 bg-gray-50"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors duration-300 bg-gray-50"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors duration-300 bg-gray-50"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors duration-300 bg-gray-50 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 1rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5rem'
                  }}
                >
                  <option value="student">👨‍🎓 Student</option>
                  <option value="teacher">👨‍🏫 Teacher</option>
                  <option value="admin">👨‍💼 Administrator</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-4">
              {/* Sign up button - Black */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 text-white bg-black rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 font-medium text-lg"
              >
                Create Account
              </motion.button>

              {/* Login redirect - White with black border */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/login")}
                className="w-full py-3 px-4 border-2 border-black text-black bg-white rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 font-medium"
              >
                Already have an account? Sign In
              </motion.button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Social login placeholder */}
            <div className="grid grid-cols-3 gap-3">
              {['G', 'F', 'T'].map((letter, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-2 border-2 border-gray-200 rounded-xl hover:border-black transition-colors duration-300 text-gray-600 hover:text-black font-bold"
                >
                  {letter}
                </motion.button>
              ))}
            </div>
          </motion.form>

          {/* Footer text */}
          <p className="text-center text-sm text-gray-500 mt-8">
            By signing up, you agree to our{' '}
            <a href="#" className="text-black font-medium hover:underline">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-black font-medium hover:underline">Privacy Policy</a>
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -z-10 -bottom-6 -right-6 w-72 h-72 bg-gray-900 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute -z-10 -top-6 -left-6 w-72 h-72 bg-gray-900 rounded-full opacity-5 blur-3xl"></div>
      </motion.div>
    </div>
  );
};

export default Auth;
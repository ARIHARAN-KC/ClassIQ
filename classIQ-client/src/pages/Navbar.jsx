import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-xl font-bold text-blue-600">
                        ClassroomApp
                    </Link>
                    <div className="flex space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                        <Link to="/classroom" className="text-gray-700 hover:text-blue-600">
                            Classroom
                        </Link>
                        <Link to="/teacher" className="text-gray-700 hover:text-blue-600">
                            Teacher
                        </Link>
                        <Link to="/auth" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
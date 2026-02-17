import { useState } from "react";

const AssignmentUpload = () => {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload your assignment file");
      return;
    }

    // Demo action (replace with backend API)
    alert("Assignment submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-lg p-6">
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Upload Assignment
        </h2>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Assignment Title</p>
          <h3 className="font-semibold text-lg">
            Data Structures – Unit 2
          </h3>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Description</p>
          <p className="text-gray-700 text-sm">
            Implement Stack and Queue operations with examples.
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Due Date</p>
          <p className="text-red-600 font-medium">20 Feb 2026</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium">
            Upload File
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx,.zip"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer focus:outline-none p-2"
          />

          {file && (
            <p className="text-sm text-green-600 mt-2">
              Selected: {file.name}
            </p>
          )}

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Assignment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignmentUpload;

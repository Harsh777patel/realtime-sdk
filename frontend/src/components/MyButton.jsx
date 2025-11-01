import React from "react";

const MyButton = ({ text, primary }) => {
  return (
    <button
      className={`px-6 py-3 rounded-lg font-medium transition ${
        primary ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {text}
    </button>
  );
};

export default MyButton;

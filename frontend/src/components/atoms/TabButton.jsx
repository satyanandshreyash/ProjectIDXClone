import React from "react";

const TabButton = ({ isActive = true }) => {
  const handleClick = () => {};
  return (
    <>
      <button
        className={`bg-[#24292e] text-gray-300 px-6 py-2 border-r-1 border-r-gray-500 border-b-1 border-b-gray-500 ${
          isActive ? "border-t-4 border-blue-600" : ""
        }`}
        onClick={handleClick}
      >
        <h1 className="text-sm">TabButton.jsx</h1>
      </button>
    </>
  );
};

export default TabButton;

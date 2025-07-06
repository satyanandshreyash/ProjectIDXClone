import React from "react";
import { useActiveFileTabStore } from "../../store/activeFileTabStore";
import { getFileNameWithExtension } from "../../utils/getFileExtension";

const TabButton = ({ isActive = true }) => {
  const handleClick = () => {};
  const { activeFileTab } = useActiveFileTabStore();
  const name = getFileNameWithExtension(activeFileTab?.path);
  return (
    <>
      {activeFileTab && (
        <button
          className={`bg-[hsl(0,0%,20%)] font-semibold text-[hsl(0,0%,90%)] px-6 py-2 border-r-1 border-r-gray-500 border-b-1 border-b-gray-500 ${
            isActive ? "border-t-4 border-blue-600" : ""
          }`}
          onClick={handleClick}
        >
          <h1 className="text-sm">{name}</h1>
        </button>
      )}
    </>
  );
};

export default TabButton;

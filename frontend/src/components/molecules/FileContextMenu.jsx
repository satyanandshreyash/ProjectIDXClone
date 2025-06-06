import React from "react";
import { useFileContextMenuStore } from "../../store/fileContextMenuStore";
import { useEditorSocketStore } from "../../store/editorSocketStore";

const FileContextMenu = ({ x, y, path }) => {
  const { setIsOpen } = useFileContextMenuStore();
  const { editorSocket } = useEditorSocketStore();

  const handleFileDelete = (e) => {
    e.preventDefault();
    editorSocket.emit("deleteFile", { path: path });
  };
  return (
    <div
      onMouseLeave={() => {
        setIsOpen(false);
      }}
      className="w-[200px] fixed flex flex-col gap-1 rounded-md border bg-black border-gray-700 shadow-md z-50  py-2"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <button
        className="hover:bg-gray-600 text-left px-6 rounded-md"
        onClick={handleFileDelete}
      >
        Delete
      </button>
      <button className="hover:bg-gray-600 text-left px-6 rounded-md">
        Rename
      </button>
    </div>
  );
};

export default FileContextMenu;

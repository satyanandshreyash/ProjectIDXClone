import React from "react";
import { useFolderContextMenuStore } from "../../store/folderContextMenuStore";
import { useEditorSocketStore } from "../../store/editorSocketStore";

const FolderContextMenu = ({ x, y, path }) => {
  const { setFolderIsOpen } = useFolderContextMenuStore();
  const { editorSocket } = useEditorSocketStore();

  const handleCreateNewFile = (e) => {
    e.preventDefault();
    editorSocket.emit("createFile", { path: path + "/" + "newFile.js" });
  };

  const handleCreateNewFolder = (e) => {
    e.preventDefault();
    editorSocket.emit("createFolder", { path: path + "/" + "newFolder" });
  };

  const handleDeleteFolder = (e) => {
    e.preventDefault();
    editorSocket.emit("deleteFolder", { path: path });
  };

  return (
    <div
      onMouseLeave={() => {
        setFolderIsOpen(false);
      }}
      className="w-[200px] fixed flex flex-col gap-1 rounded-md border bg-black border-gray-700 shadow-md z-50  py-2"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <button
        className="hover:bg-gray-600 text-left px-6 rounded-md"
        onClick={handleCreateNewFile}
      >
        New File
      </button>
      <button
        className="hover:bg-gray-600 text-left px-6 rounded-md"
        onClick={handleCreateNewFolder}
      >
        New Folder
      </button>
      <button
        className="hover:bg-gray-600 text-left px-6 rounded-md"
        onClick={handleDeleteFolder}
      >
        Delete
      </button>
    </div>
  );
};

export default FolderContextMenu;

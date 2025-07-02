import React, { useEffect } from "react";
import { useTreeStructureStore } from "../../../store/treeStructureStore";
import { useParams } from "react-router-dom";
import { useProjectTree } from "../../../hooks/apis/queries/useProjectTree";
import TreeNode from "../../molecules/TreeNode";
import { useState } from "react";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import FileContextMenu from "../../molecules/FileContextMenu";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";
import FolderContextMenu from "../../molecules/FolderContextMenu";

const TreeStructure = () => {
  const { projectId } = useParams();
  const { isLoading, isError } = useProjectTree(projectId);
  const { treeStructure } = useTreeStructureStore();

  const {
    folderIsOpen: isFolderContextMenuOpen,
    folderX: FolderContextMenuX,
    folderY: FolderContextMenuY,
    folder,
  } = useFolderContextMenuStore();

  const {
    x: FileContextMenuX,
    y: FileContextMenuY,
    isOpen: isFileContextMenuOpen,
    file,
  } = useFileContextMenuStore();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching tree</div>;
  return (
    <div className="border-r border-gray-600 h-[90vh]">
      <h1 className="font-bold text-lg ml-3">Explorer</h1>
      {isFolderContextMenuOpen && FolderContextMenuX && FolderContextMenuY && (
        <FolderContextMenu
          x={FolderContextMenuX}
          y={FolderContextMenuY}
          path={folder}
        />
      )}
      {isFileContextMenuOpen && FileContextMenuX && FileContextMenuY && (
        <FileContextMenu
          x={FileContextMenuX}
          y={FileContextMenuY}
          path={file}
        />
      )}
      <TreeNode fileFolderData={treeStructure} />
    </div>
  );
};

export default TreeStructure;

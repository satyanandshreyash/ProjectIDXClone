import React, { useEffect } from "react";
import { useTreeStructureStore } from "../../../store/treeStructureStore";
import { useParams } from "react-router-dom";
import { useProjectTree } from "../../../hooks/apis/queries/useProjectTree";
import TreeNode from "../../molecules/TreeNode";
import { useState } from "react";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import FileContextMenu from "../../molecules/FileContextMenu";

const TreeStructure = () => {
  const { projectId } = useParams();
  const { isLoading, isError } = useProjectTree(projectId);
  const { treeStructure } = useTreeStructureStore();

  const {
    x: FileContextMenuX,
    y: FileContextMenuY,
    isOpen: isFileContextMenuOpen,
    file,
  } = useFileContextMenuStore();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching tree</div>;
  return (
    <div className="border-r-1 border-gray-400">
      <h1 className="font-bold text-lg ml-3">Explorer</h1>
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

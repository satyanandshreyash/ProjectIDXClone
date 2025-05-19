import React, { useEffect } from "react";
import { useTreeStructureStore } from "../../../store/treeStructureStore";
import { useParams } from "react-router-dom";
import { useProjectTree } from "../../../hooks/apis/queries/useProjectTree";
import Tree from "../../molecules/TreeNode";

const TreeStructure = () => {
  const { projectId } = useParams();
  const { isLoading, isError } = useProjectTree(projectId);
  const { treeStructure } = useTreeStructureStore();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching tree</div>;
  return (
    <div className="border-r-1 border-gray-400">
      <h1 className="font-bold text-lg ml-3">Explorer</h1>
      <Tree fileFolderData={treeStructure} />
    </div>
  );
};

export default TreeStructure;

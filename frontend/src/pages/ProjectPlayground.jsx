import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import TextEditor from "../components/molecules/TextEditor";
import TabButton from "../components/atoms/TabButton";
import TreeStructure from "../components/organisms/TreeStructure/TreeStructure";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { io } from "socket.io-client";

const ProjectPlayground = () => {
  const { projectId } = useParams();
  const { setProjectId } = useTreeStructureStore();
  const { setEditorSocket } = useEditorSocketStore();
  useEffect(() => {
    if (projectId) {
      setProjectId(projectId);
      const editorSocketConnection = io(
        `${import.meta.env.VITE_BACKEND_URL}/editor`,
        {
          query: {
            projectId: projectId,
          },
        }
      );
      setEditorSocket(editorSocketConnection);
    }
  }, [projectId, setProjectId, setEditorSocket]);
  return (
    <div className="bg-[#181818] text-gray-300 min-h-screen w-screen">
      <h1>Project Playground</h1>
      <p>Project ID: {projectId}</p>
      <div className="flex h-full">
        <TreeStructure />
        <div className="flex-1">
          <TabButton />
          <TextEditor />
        </div>
      </div>
    </div>
  );
};

export default ProjectPlayground;

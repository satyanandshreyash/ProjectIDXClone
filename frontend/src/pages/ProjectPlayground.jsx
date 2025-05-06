import React from "react";
import { useParams } from "react-router-dom";
import TextEditor from "../components/molecules/TextEditor";
import TabButton from "../components/atoms/TabButton";

const ProjectPlayground = () => {
  const { projectId } = useParams();
  return (
    <div className="bg-[#2A2A2A] text-gray-300 min-h-screen">
      <h1>Project Playground</h1>
      <p>Project ID: {projectId}</p>
      <TabButton />
      <TextEditor />
    </div>
  );
};

export default ProjectPlayground;

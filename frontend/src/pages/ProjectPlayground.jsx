import React from "react";
import { useParams } from "react-router-dom";
import TextEditor from "../components/molecules/TextEditor";

const ProjectPlayground = () => {
  const { projectId } = useParams();
  return (
    <div>
      <h1>Project Playground</h1>
      <p>Project ID: {projectId}</p>
      <TextEditor />
    </div>
  );
};

export default ProjectPlayground;

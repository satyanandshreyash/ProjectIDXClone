import React from "react";
import { Button } from "antd";
import { useCreateProject } from "../hooks/apis/mutations/useCreateProject";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const navigate = useNavigate();
  const { createProjectMutation, isPending, isSuccess, error } =
    useCreateProject();
  const handleCreateProject = async () => {
    try {
      const response = await createProjectMutation();
      console.log("Now we should redirect to the project page");
      navigate(`/project/${response.projectId}`);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[hsl(0,0%,5%)] text-white">
      <button
        onClick={handleCreateProject}
        className="bg-[hsl(0,0%,10%)] p-4 rounded-lg border-[hsl(0,0%,20%)] border hover:bg-[hsl(0,0%,15%)] transition-colors duration-300 text-[hsl(0,0%,90%)] font-semibold cursor-pointer"
      >
        Create Project
      </button>
      {isPending && <p>Creating project...</p>}
      {isSuccess && <p>Project created successfully!</p>}
      {error && <p>Error creating project: {error.message}</p>}
    </div>
  );
};

export default CreateProject;

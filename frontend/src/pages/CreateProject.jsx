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
    <div>
      <h1>Create Project</h1>
      <Button onClick={handleCreateProject} type="primary">
        Create Project
      </Button>
      {isPending && <p>Creating project...</p>}
      {isSuccess && <p>Project created successfully!</p>}
      {error && <p>Error creating project: {error.message}</p>}
    </div>
  );
};

export default CreateProject;

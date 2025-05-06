import React from "react";
import { Route, Routes } from "react-router-dom";
import ProjectPlayground from "./pages/ProjectPlayground";
import CreateProject from "./pages/CreateProject";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<CreateProject />} />
      <Route path="/project/:projectId" element={<ProjectPlayground />} />
    </Routes>
  );
};

export default Router;

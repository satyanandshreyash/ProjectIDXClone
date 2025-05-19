import React from "react";
import { FaJsSquare } from "react-icons/fa";
import { FaReact } from "react-icons/fa6";
import { IoLogoCss3 } from "react-icons/io";
import { FaGitAlt } from "react-icons/fa6";
import { IoLogoMarkdown } from "react-icons/io";
import { FaHtml5 } from "react-icons/fa";
import { FaNodeJs } from "react-icons/fa6";
import { ImSvg } from "react-icons/im";

const FileIcon = ({ extension }) => {
  return (
    <>
      {extension === "js" && <FaJsSquare color="#F0DB4F" size={18} />}
      {extension === "jsx" && <FaReact color="#61DBFA" size={18} />}
      {extension === "css" && <IoLogoCss3 color="#3c99dc" size={18} />}
      {extension === "gitignore" && <FaGitAlt color="#F1502F" size={18} />}
      {extension === "md" && <IoLogoMarkdown color="#2965f1" size={18} />}
      {extension === "html" && <FaHtml5 color="#E34C26" size={18} />}
      {extension === "json" && <FaNodeJs color="#68a063" size={18} />}
      {extension === "svg" && <ImSvg color="#FFB800" size={18} />}
    </>
  );
};

export default FileIcon;

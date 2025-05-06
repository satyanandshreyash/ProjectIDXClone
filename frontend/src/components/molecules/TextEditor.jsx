import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

const TextEditor = () => {
  const [editorState, setEditorState] = useState({
    theme: null,
  });
  const fetchThemeData = async () => {
    const response = await fetch("/GitHubDark.json");
    const data = await response.json();
    setEditorState((prevState) => ({
      ...prevState,
      theme: data,
    }));
  };

  const handleEditorTheme = (editor, monaco) => {
    monaco.editor.defineTheme("GitHubDark", editorState.theme);
    monaco.editor.setTheme("GitHubDark");
  };

  useEffect(() => {
    fetchThemeData();
  }, []);
  return (
    <>
      {editorState.theme && (
        <Editor
          height={"80vh"}
          width={"100%"}
          language="javascript"
          defaultValue="//Code Here"
          options={{
            fontSize: 18,
            fontFamily: "Source Code Pro",
            minimap: {
              enabled: true,
            },
          }}
          theme="vs-dark"
          onMount={handleEditorTheme}
        />
      )}
    </>
  );
};

export default TextEditor;

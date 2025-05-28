import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useEditorSocketStore } from "../../store/editorSocketStore";
import { useActiveFileTabStore } from "../../store/activeFileTabStore";

const TextEditor = () => {
  const [editorState, setEditorState] = useState({
    theme: null,
  });
  const { editorSocket } = useEditorSocketStore();
  const { activeFileTab, setActiveFileTab } = useActiveFileTabStore();
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

  editorSocket?.on("readFileSuccess", (data) => {
    console.log("File read successfully:", data);
    setActiveFileTab(data.path, data.data);
  });

  useEffect(() => {
    fetchThemeData();
  }, []);
  return (
    <>
      {editorState.theme && (
        <Editor
          height={"80vh"}
          width={"100%"}
          language=""
          defaultValue="//Code Here"
          options={{
            fontSize: 18,
            fontFamily: "Source Code Pro",
            minimap: {
              enabled: true,
            },
          }}
          value={activeFileTab?.value || " //Code Here"}
          theme="vs-dark"
          onMount={handleEditorTheme}
        />
      )}
    </>
  );
};

export default TextEditor;

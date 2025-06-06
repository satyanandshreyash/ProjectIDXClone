import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useActiveFileTabStore } from "../../store/activeFileTabStore";
import { useEditorSocketStore } from "../../store/editorSocketStore";
import { extensionToFileType } from "../../utils/extensionToFileType";

const TextEditor = () => {
  let timerId = null;
  const [editorState, setEditorState] = useState({
    theme: null,
  });
  const { activeFileTab } = useActiveFileTabStore();
  const { editorSocket } = useEditorSocketStore();
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

  const handleChange = (value) => {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      editorSocket?.emit("writeFile", {
        data: value,
        path: activeFileTab?.path,
      });
    }, 2000);
  };

  useEffect(() => {
    fetchThemeData();
  }, []);

  return (
    <>
      {editorState.theme && (
        <Editor
          height={"90vh"}
          width={"100%"}
          language={extensionToFileType(activeFileTab?.extension)}
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
          onChange={handleChange}
        />
      )}
    </>
  );
};

export default TextEditor;

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TextEditor from "../components/molecules/TextEditor";
import TabButton from "../components/atoms/TabButton";
import TreeStructure from "../components/organisms/TreeStructure/TreeStructure";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { io } from "socket.io-client";
import { useModalStore } from "../store/modalStore";
import Modal from "react-modal";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useActiveFileTabStore } from "../store/activeFileTabStore";
import BrowserTerminal from "../components/molecules/BrowserTerminal";
import { useTerminalSocketStore } from "../store/terminalSocketStore";
import { usePortStore } from "../store/portStore";
import Browser from "../components/organisms/Browser/Browser";

const ProjectPlayground = () => {
  const { projectId } = useParams();
  const { setProjectId } = useTreeStructureStore();
  const { editorSocket, setEditorSocket } = useEditorSocketStore();
  const { isTerminalReady, setTerminalSocket } = useTerminalSocketStore();
  const { activeFileTab } = useActiveFileTabStore();
  const { port } = usePortStore();

  const [showBrowser, setShowBrowser] = useState(false);

  const {
    isModalOpen,
    modalHeading,
    modalPlaceholder,
    modalPurpose,
    modalTargetPath,
    setIsModalOpen,
  } = useModalStore();
  const fileFolderNameRef = useRef(null);

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

    const ws = new WebSocket("/terminal?projectId=" + projectId);

    setTerminalSocket(ws);
  }, [projectId, setProjectId, setEditorSocket, setTerminalSocket]);

  const handleFileFolderCreation = (e) => {
    e.preventDefault();
    if (modalPurpose === "createFolder") {
      editorSocket.emit("createFolder", {
        path: modalTargetPath + "/" + fileFolderNameRef.current.value,
      });
    } else if (modalPurpose === "createFile") {
      editorSocket.emit("createFile", {
        path: modalTargetPath + "/" + fileFolderNameRef.current.value,
      });
    }
    setIsModalOpen(false);
  };

  const fetchPorts = () => {
    editorSocket.emit("getPort", { containerName: projectId });
  };

  useEffect(() => {
    if (isTerminalReady && editorSocket && projectId) {
      editorSocket.emit("getPort", { containerName: projectId });
    }
  }, [isTerminalReady, editorSocket, projectId]);

  return (
    <div className="bg-[#181818] text-gray-300 min-h-screen w-screen">
      <div className="flex justify-between px-4 items-center py-2">
        <h1>Project Playground : {projectId}</h1>
        <button
          onClick={() => {
            // fetchPorts();
            setShowBrowser(!showBrowser);
          }}
          className="bg-[hsl(0,0%,25%)] p-2 text-lg rounded-lg cursor-pointer"
        >
          {showBrowser ? "Hide Browser" : "Show Browser"}
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onAfterOpen={() => {
          fileFolderNameRef.current.focus();
        }}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="File or Folder Name Modal"
        className="p-4 bg-[#181818] rounded-md border border-gray-700 text-gray-200"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-[9999]"
      >
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-center">{modalHeading}</h1>
          <form action="submit" onSubmit={handleFileFolderCreation}>
            <input
              ref={fileFolderNameRef}
              type="text"
              className="border border-gray-700 px-4 py-1 outline-none"
              placeholder={modalPlaceholder}
            />
          </form>
        </div>
      </Modal>
      <div className="h-[90vh] w-full ">
        <Allotment>
          <Allotment.Pane maxSize={366} snap>
            <TreeStructure />
          </Allotment.Pane>
          <Allotment vertical>
            <Allotment.Pane>
              <div className="w-full h-full">
                <TabButton />
                {activeFileTab && <TextEditor />}
              </div>
            </Allotment.Pane>
            <Allotment.Pane snap>
              <div className="w-full h-full">
                {!isTerminalReady && (
                  <p className="text-yellow-400 text-sm italic mt-1">
                    Waiting for terminal to connect...
                  </p>
                )}
                <BrowserTerminal />
              </div>
            </Allotment.Pane>
          </Allotment>
          {showBrowser && <Browser />}
        </Allotment>
      </div>
    </div>
  );
};

export default ProjectPlayground;

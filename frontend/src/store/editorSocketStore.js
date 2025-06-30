import { create } from "zustand";
import { useActiveFileTabStore } from "./activeFileTabStore";
import { useTreeStructureStore } from "./treeStructureStore";
import { getProjectTree } from "../apis/project";
import { getFileExtension } from "../utils/getFileExtension";
import { usePortStore } from "./portStore";

export const useEditorSocketStore = create((set) => ({
    editorSocket: null,
    setEditorSocket: (socket) => {

        const activeFileTabSetter = useActiveFileTabStore.getState().setActiveFileTab;
        const projectTreeStructureSetter = useTreeStructureStore.getState().setTreeStructure;
        const portSetter = usePortStore.getState().setPort;

        socket?.on("readFileSuccess", (data) => {
            // console.log("File read successfully:", data);
            activeFileTabSetter(data.path, data.data, getFileExtension(data.path));
        });

        socket?.on("writeFileSuccess", (data) => {
            console.log("File written successfully:", data);
            // socket.emit("readFile", {
            //     path: data.path
            // })
        });

        socket?.on("deleteFileSuccess", async () => {
            const projectId = useTreeStructureStore.getState().projectId;
            const updatedTreeStructure = await getProjectTree({ projectId });
            projectTreeStructureSetter(updatedTreeStructure);
        });

        socket?.on("createFileSuccess", async () => {
            const projectId = useTreeStructureStore.getState().projectId;
            const updatedTreeStructure = await getProjectTree({ projectId });
            projectTreeStructureSetter(updatedTreeStructure);
        })

        socket?.on("createFolderSuccess", async () => {
            const projectId = useTreeStructureStore.getState().projectId;
            const updatedTreeStructure = await getProjectTree({ projectId });
            projectTreeStructureSetter(updatedTreeStructure);
        })

        socket?.on("deleteFolderSuccess", async () => {
            const projectId = useTreeStructureStore.getState().projectId;
            const updatedTreeStructure = await getProjectTree({ projectId });
            projectTreeStructureSetter(updatedTreeStructure);
        });

        socket?.on("getPortSuccess", ({ port }) => {
            console.log("Port received from server:", port);
            portSetter(port);
        })

        set({ editorSocket: socket });
    }
}));
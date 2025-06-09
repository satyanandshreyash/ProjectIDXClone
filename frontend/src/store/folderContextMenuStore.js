import { create } from "zustand";

export const useFolderContextMenuStore = create((set) => ({
    folderX: null,
    folderY: null,
    folderIsOpen: false,
    folder: null,
    setFolderX: (givenX) => set({ folderX: givenX }),
    setFolderY: (givenY) => set({ folderY: givenY }),
    setFolderIsOpen: (isOpen) => set({ folderIsOpen: isOpen }),
    setFolder: (folder) => set({ folder }),
}))
import { create } from 'zustand';

export const useFileContextMenuStore = create((set) => ({
    x: null,
    y: null,
    isOpen: false,
    file: null,
    setX: (givenX) => set({ x: givenX }),
    setY: (givenY) => set({ y: givenY }),
    setIsOpen: (isOpen) => set({ isOpen }),
    setFile: (file) => set({ file }),
}))
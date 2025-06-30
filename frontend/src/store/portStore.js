import { create } from 'zustand';

export const usePortStore = create((set) => ({
    port: null,
    setPort: (port) => set({ port }),
}));
import { create } from 'zustand';

export const useTerminalSocketStore = create((set) => ({
    terminalSocket: null,
    isTerminalReady: false,
    setTerminalSocket: (incomingSocket) => set({ terminalSocket: incomingSocket }),
    setIsTerminalReady: (ready) => set({ isTerminalReady: ready }),
}));
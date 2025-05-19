import { create } from 'zustand';
import { getProjectTree } from '../apis/project';
import { QueryClient } from '@tanstack/react-query';

export const useTreeStructureStore = create((set) => {

    return {
        projectId: null,
        treeStructure: null,
        setTreeStructure: (data) => {
            set({ treeStructure: data })
        },
        setProjectId: (id) => {
            set({ projectId: id })
        },
    }
})
import { create } from "zustand";

export const useModalStore = create((set) => ({
    isModalOpen: false,
    modalHeading: null,
    modalPlaceholder: null,
    modalPurpose: null,
    modalTargetPath: null,
    setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
    setModalHeading: (heading) => set({ modalHeading: heading }),
    setModalPlaceholder: (placeholder) => set({ modalPlaceholder: placeholder }),
    setModalInputValue: (value) => set({ modalInputValue: value }),
    setModalPurpose: (purpose) => set({ modalPurpose: purpose }),
    setModalTargetPath: (path) => set({ modalTargetPath: path }),
}));
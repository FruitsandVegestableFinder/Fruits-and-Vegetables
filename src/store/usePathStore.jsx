import { create } from "zustand";

const usePathStore = create((set) => ({
  currentPath: window.location.pathname,
  setPathFromWindow: () => set({ currentPath: window.location.pathname }),
}));

export default usePathStore;

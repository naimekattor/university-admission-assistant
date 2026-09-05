import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  compareList: string[]; // university slugs/IDs (max 3)
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleCompare: (uniId: string) => void;
  clearCompare: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  compareList: [],
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleCompare: (uniId) =>
    set((state) => {
      if (state.compareList.includes(uniId)) {
        return { compareList: state.compareList.filter((id) => id !== uniId) };
      }
      if (state.compareList.length >= 3) {
        return state; // Max 3 items in compare dock
      }
      return { compareList: [...state.compareList, uniId] };
    }),
  clearCompare: () => set({ compareList: [] }),
}));

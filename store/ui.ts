// store/ui.ts
import { create } from 'zustand';

type Toast = { id: string; message: string };

type UIStore = {
  levelUpVisible: boolean;
  showLevelUp: () => void;
  hideLevelUp: () => void;
  toasts: Toast[];
  addToast: (message: string) => void;
  removeToast: (id: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  levelUpVisible: false,
  showLevelUp: () => set({ levelUpVisible: true }),
  hideLevelUp: () => set({ levelUpVisible: false }),
  toasts: [],
  addToast: (message) =>
    set((s) => ({
      toasts: [...s.toasts, { id: Date.now().toString(), message }],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  theme: 'default',
  setTheme: (theme) => set({ theme }),
}));

import { create } from "zustand";

interface CoffeeScrollState {
  currentIndex: number;
  progress: number;
  direction: number;
  setCurrentIndex: (index: number) => void;
  setProgress: (progress: number) => void;
  setDirection: (direction: number) => void;
}

export const useCoffeeScrollStore = create<CoffeeScrollState>((set) => ({
  currentIndex: 0,
  progress: 0,
  direction: 0,
  setCurrentIndex: (index) => set({ currentIndex: index }),
  setProgress: (progress) => set({ progress }),
  setDirection: (direction) => set({ direction }),
}));

// store/character.ts
import { create } from 'zustand';

export type CharacterState = {
  id: string;
  name: string;
  class: string;
  level: number;
  xp: number;
  gold: number;
  streak: number;
  intellect: number;
  strength: number;
  wisdom: number;
  creativity: number;
  endurance: number;
};

type Store = {
  character: CharacterState | null;
  setCharacter: (c: CharacterState) => void;
  addXP: (xp: number) => void;
  addGold: (gold: number) => void;
  snapshot: CharacterState | null;
  saveSnapshot: () => void;
  rollback: () => void;
};

export const useCharacterStore = create<Store>((set, get) => ({
  character: null,
  snapshot: null,
  setCharacter: (c) => set({ character: c }),
  addXP: (xp) =>
    set((s) => ({
      character: s.character ? { ...s.character, xp: s.character.xp + xp } : null,
    })),
  addGold: (gold) =>
    set((s) => ({
      character: s.character ? { ...s.character, gold: s.character.gold + gold } : null,
    })),
  saveSnapshot: () => set((s) => ({ snapshot: s.character })),
  rollback: () => set((s) => ({ character: s.snapshot })),
}));

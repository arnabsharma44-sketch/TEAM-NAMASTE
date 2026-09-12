// lib/game.ts

export type Character = {
  level: number;
  xp: number;
  gold: number;
  streak: number;
  lastActive: Date;
  intellect: number;
  strength: number;
  wisdom: number;
  creativity: number;
  endurance: number;
};

export function xpForLevel(n: number): number {
  return n * n * 100;
}

export const XP_REWARDS: Record<string, number>   = { EASY: 50,  MEDIUM: 150, HARD: 300 };
export const GOLD_REWARDS: Record<string, number>  = { EASY: 10,  MEDIUM: 30,  HARD: 60  };

export function streakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 7)  return 1.5;
  return 1.0;
}

export function applyXP(char: Character, xpGained: number): Character {
  char.xp += xpGained;
  while (char.xp >= xpForLevel(char.level + 1)) {
    char.xp -= xpForLevel(char.level + 1);
    char.level++;
  }
  return char;
}

export function updateStreak(char: Character): Character {
  const diff = daysBetween(char.lastActive, new Date());
  if (diff === 1)      char.streak++;
  else if (diff > 1)   char.streak = 1;
  // diff === 0: same day, no change
  char.lastActive = new Date();
  return char;
}

export function daysBetween(a: Date, b: Date): number {
  const ms = Math.abs(b.getTime() - new Date(a).getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export const ATTRIBUTE_MAP: Record<string, keyof Character> = {
  INTELLECT:  'intellect',
  STRENGTH:   'strength',
  WISDOM:     'wisdom',
  CREATIVITY: 'creativity',
  ENDURANCE:  'endurance',
};

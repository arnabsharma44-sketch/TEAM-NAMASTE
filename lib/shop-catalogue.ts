// lib/shop-catalogue.ts

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'theme' | 'badge' | 'skin';
  icon: string;
};

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'theme-dark-dungeon',
    name: 'Dark Dungeon',
    description: 'A shadowy dungeon aesthetic with crimson accents.',
    price: 200,
    type: 'theme',
    icon: '🏰',
  },
  {
    id: 'theme-neon-cyber',
    name: 'Neon Cyber',
    description: 'Cyberpunk neon glows on a dark matrix background.',
    price: 250,
    type: 'theme',
    icon: '⚡',
  },
  {
    id: 'theme-cozy-tavern',
    name: 'Cozy Tavern',
    description: 'Warm firelight and weathered wood tones.',
    price: 150,
    type: 'theme',
    icon: '🍺',
  },
  {
    id: 'badge-veteran',
    name: 'Veteran Badge',
    description: 'Mark of a warrior who survived 30 consecutive days.',
    price: 500,
    type: 'badge',
    icon: '🏅',
  },
  {
    id: 'badge-scholar',
    name: 'Scholar Badge',
    description: 'Awarded to those of great intellectual pursuit.',
    price: 300,
    type: 'badge',
    icon: '📚',
  },
  {
    id: 'skin-warrior',
    name: 'Warrior Skin',
    description: 'Armored warrior avatar with battle scars.',
    price: 400,
    type: 'skin',
    icon: '⚔️',
  },
];

export type RarityTier = '5-Star UR' | '4-Star SSR';

export interface ExpressionItem {
  id: string;
  name: string;
  emoji: string;
  dialogue: string;
  moodColor: string;
  description: string;
}

export interface ChibiCharacter {
  id: string;
  name: string;
  japaneseName: string;
  seriesId: string;
  seriesName: string;
  rarity: RarityTier;
  catchphrase: string;
  catchphraseAudioText: string;
  personalityTags: string[];
  imageUrl: string;
  likes: number;
  collectorNumber: string;
  element: 'Electric' | 'Magic' | 'Chaos' | 'Cosmic' | 'Wind' | 'Flame' | 'Sound' | 'Spirit';
  expressions: ExpressionItem[];
  lore: string;
  height: string;
  favoriteItem: string;
}

export interface AnimeSeries {
  id: string;
  title: string;
  japaneseTitle: string;
  itemCount: number;
  badgeColor: string;
  icon: string;
  genre: string;
  releaseYear: number;
}

export type ViewMode = 'grid' | 'compact' | 'deck';
export type SortOption = 'popular' | 'rarity' | 'name' | 'series';

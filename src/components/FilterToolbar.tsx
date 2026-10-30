import React from 'react';
import { Search, X, LayoutGrid, ListFilter, Sparkles, SlidersHorizontal, Heart, GalleryHorizontalEnd } from 'lucide-react';
import { ViewMode, SortOption, RarityTier } from '../types';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRarity: RarityTier | 'ALL';
  onSelectRarity: (rarity: RarityTier | 'ALL') => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onlyFavorites: boolean;
  onToggleFavorites: () => void;
  totalFiltered: number;
  availableTags: string[];
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedRarity,
  onSelectRarity,
  selectedTag,
  onSelectTag,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onlyFavorites,
  onToggleFavorites,
  totalFiltered,
  availableTags,
}) => {
  return (
    <div className="w-full space-y-3">
      {/* Top Controls: Character Search + Sort + View Mode Toggles */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Character Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search characters by name, personality tag, catchphrase, or lore..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl bg-[#131a2a]/80 border border-purple-500/20 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50"
              title="Clear character search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right side: Sort Dropdown & View Mode Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131a2a]/80 border border-purple-500/20 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-300" />
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-medium pr-1"
            >
              <option value="popular" className="bg-[#131a2a] text-white">Most Popular (Likes)</option>
              <option value="rarity" className="bg-[#131a2a] text-white">Rarity (UR first)</option>
              <option value="name" className="bg-[#131a2a] text-white">Name (A-Z)</option>
              <option value="series" className="bg-[#131a2a] text-white">Series Title</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#131a2a]/80 border border-purple-500/20">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Standard Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Grid</span>
            </button>
            <button
              onClick={() => onViewModeChange('compact')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                viewMode === 'compact'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Compact Sticker View"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Compact</span>
            </button>
            <button
              onClick={() => onViewModeChange('deck')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                viewMode === 'deck'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Card Deck 3D Showcase"
            >
              <GalleryHorizontalEnd className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Card Deck</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Filter Chips: Rarity & Personality Tags & Favorites */}
      <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
        {/* Rarity Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#0b0f19] border border-slate-800">
          <button
            onClick={() => onSelectRarity('ALL')}
            className={`px-3 py-1 rounded-md transition-colors font-medium ${
              selectedRarity === 'ALL'
                ? 'bg-purple-600/40 text-purple-200 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Tiers
          </button>
          <button
            onClick={() => onSelectRarity('5-Star UR')}
            className={`px-3 py-1 rounded-md transition-colors font-medium flex items-center gap-1 ${
              selectedRarity === '5-Star UR'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>5-Star UR</span>
          </button>
          <button
            onClick={() => onSelectRarity('4-Star SSR')}
            className={`px-3 py-1 rounded-md transition-colors font-medium flex items-center gap-1 ${
              selectedRarity === '4-Star SSR'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-purple-300'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>4-Star SSR</span>
          </button>
        </div>

        {/* Favorites Filter Button */}
        <button
          onClick={onToggleFavorites}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-all ${
            onlyFavorites
              ? 'bg-rose-500/25 border-rose-500/50 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
              : 'bg-[#131a2a]/60 border-slate-800 text-slate-400 hover:text-rose-300 hover:border-rose-500/30'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'text-rose-400 fill-rose-400' : ''}`} />
          <span>Favorites Only</span>
        </button>

        {/* Personality Tag Chips */}
        <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto py-1">
          {availableTags.slice(0, 7).map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onSelectTag(isSelected ? null : tag)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                    : 'bg-[#131a2a]/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

        {/* Active results count */}
        <div className="ml-auto text-xs text-slate-400">
          Showing <span className="text-cyan-300 font-semibold tabular-nums">{totalFiltered}</span> chibis
        </div>
      </div>
    </div>
  );
};

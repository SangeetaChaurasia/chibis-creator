/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AnimeSubMenu } from './components/AnimeSubMenu';
import { FilterToolbar } from './components/FilterToolbar';
import { ChibiCard } from './components/ChibiCard';
import { CardDeckShowcase } from './components/CardDeckShowcase';
import { ExpressionModal } from './components/ExpressionModal';
import { GachaModal } from './components/GachaModal';
import { StickerStudioModal } from './components/StickerStudioModal';
import { SeriesVaultView } from './components/SeriesVaultView';
import { ChibiGeneratorSection } from './components/ChibiGeneratorSection';
import { ANIME_SERIES_LIST, CHIBI_CHARACTERS } from './data/animeData';
import { ChibiCharacter, ViewMode, SortOption, RarityTier } from './types';
import { Sparkles, Dices, Layers, RefreshCw, Palette, Heart, CheckCircle2, Wand2 } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'showcase' | 'series-vault' | 'generator' | 'sticker-studio' | 'favorites'>('showcase');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  // Dynamic Character List (starts with 10 official characters, can be extended with generated chibis)
  const [characterList, setCharacterList] = useState<ChibiCharacter[]>(() => {
    try {
      const saved = localStorage.getItem('chibi_generated_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...CHIBI_CHARACTERS, ...parsed];
      }
    } catch {
      // Ignored
    }
    return CHIBI_CHARACTERS;
  });

  // Series Filtering (Anime Sub-Menu)
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  const [seriesSearchQuery, setSeriesSearchQuery] = useState('');

  // Character Filtering
  const [characterSearchQuery, setCharacterSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<RarityTier | 'ALL'>('ALL');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Favorites persistence
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('chibi_favorites');
      return saved ? new Set(JSON.parse(saved)) : new Set(['anya-forger', 'gojo-satoru']);
    } catch {
      return new Set(['anya-forger', 'gojo-satoru']);
    }
  });

  // Modals State
  const [expressionModalChar, setExpressionModalChar] = useState<ChibiCharacter | null>(null);
  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioChar, setStudioChar] = useState<ChibiCharacter | undefined>(undefined);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chibi_favorites', JSON.stringify(Array.from(favorites)));
    } catch {
      // Ignored
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddGeneratedCharacter = (newChar: ChibiCharacter) => {
    setCharacterList((prev) => {
      const updated = [newChar, ...prev];
      try {
        const generatedOnly = updated.filter((c) => c.id.startsWith('gen-'));
        localStorage.setItem('chibi_generated_list', JSON.stringify(generatedOnly));
      } catch {
        // Ignored
      }
      return updated;
    });
  };

  // Collect all unique personality tags
  const allAvailableTags = useMemo(() => {
    const set = new Set<string>();
    characterList.forEach((c) => c.personalityTags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [characterList]);

  // Filter and Sort Characters
  const filteredCharacters = useMemo(() => {
    let result = [...characterList];

    // Series filter from Sub-Menu
    if (selectedSeriesId) {
      result = result.filter((c) => c.seriesId === selectedSeriesId);
    }

    // Tab-level favorites or toggle filter
    if (activeTab === 'favorites' || onlyFavorites) {
      result = result.filter((c) => favorites.has(c.id));
    }

    // Rarity filter
    if (selectedRarity !== 'ALL') {
      result = result.filter((c) => c.rarity === selectedRarity);
    }

    // Personality Tag filter
    if (selectedTag) {
      result = result.filter((c) => c.personalityTags.includes(selectedTag));
    }

    // Text search query
    if (characterSearchQuery.trim()) {
      const q = characterSearchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.japaneseName.toLowerCase().includes(q) ||
          c.seriesName.toLowerCase().includes(q) ||
          c.catchphrase.toLowerCase().includes(q) ||
          c.lore.toLowerCase().includes(q) ||
          c.personalityTags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'popular') {
        return b.likes - a.likes;
      }
      if (sortBy === 'rarity') {
        if (a.rarity === b.rarity) return b.likes - a.likes;
        return a.rarity === '5-Star UR' ? -1 : 1;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'series') {
        return a.seriesName.localeCompare(b.seriesName);
      }
      return 0;
    });

    return result;
  }, [
    characterList,
    selectedSeriesId,
    activeTab,
    onlyFavorites,
    selectedRarity,
    selectedTag,
    characterSearchQuery,
    sortBy,
    favorites,
  ]);

  const activeSeriesObject = useMemo(() => {
    return ANIME_SERIES_LIST.find((s) => s.id === selectedSeriesId);
  }, [selectedSeriesId]);

  const handleOpenStudio = (character?: ChibiCharacter) => {
    setStudioChar(character || CHIBI_CHARACTERS[0]);
    setIsStudioOpen(true);
  };

  const clearAllFilters = () => {
    setSelectedSeriesId(null);
    setSeriesSearchQuery('');
    setCharacterSearchQuery('');
    setSelectedRarity('ALL');
    setSelectedTag(null);
    setOnlyFavorites(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#dfe2f1] flex flex-col font-sans selection:bg-purple-500/30 selection:text-cyan-300">
      {/* 1. Top Bar Navigation Contract */}
      <Navbar
        onOpenGacha={() => setIsGachaOpen(true)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab as any);
          if (tab === 'sticker-studio') {
            setIsStudioOpen(true);
          }
        }}
        favoriteCount={favorites.size}
      />

      {/* 2. Interactive Anime Sub-Menu & Search Bar (Secondary Category Bar) */}
      <AnimeSubMenu
        seriesList={ANIME_SERIES_LIST}
        selectedSeriesId={selectedSeriesId}
        onSelectSeries={(id) => {
          setSelectedSeriesId(id);
          if (activeTab !== 'showcase') setActiveTab('showcase');
        }}
        seriesSearchQuery={seriesSearchQuery}
        onSeriesSearchChange={setSeriesSearchQuery}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Conditional View Switching */}
        {activeTab === 'series-vault' ? (
          <SeriesVaultView
            seriesList={ANIME_SERIES_LIST}
            characters={characterList}
            onSelectSeries={(id) => {
              setSelectedSeriesId(id);
              setActiveTab('showcase');
            }}
            onOpenExpressions={(char) => setExpressionModalChar(char)}
          />
        ) : activeTab === 'generator' ? (
          <ChibiGeneratorSection
            baseCharacters={CHIBI_CHARACTERS}
            onAddGeneratedCharacter={handleAddGeneratedCharacter}
            onOpenExpressions={(char) => setExpressionModalChar(char)}
            onOpenStudio={(char) => handleOpenStudio(char)}
          />
        ) : (
          <>
            {/* Hero / Active Series Banner */}
            <section className="relative glass-panel rounded-3xl p-6 sm:p-8 overflow-hidden border border-purple-500/25">
              {/* Neon Glow Aura */}
              <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="max-w-2xl space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400/30 text-purple-200">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Official Chibi Collector Cards & Stickers</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white" style={{ textWrap: 'balance' }}>
                    {activeSeriesObject ? (
                      <>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-300">
                          {activeSeriesObject.title}
                        </span>{' '}
                        Vault
                      </>
                    ) : activeTab === 'favorites' ? (
                      <>
                        Your <span className="text-rose-400">Favorite</span> Chibi Collection
                      </>
                    ) : (
                      <>
                        Explore Anime Legends in{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-300">
                          Cute Chibi Form
                        </span>
                      </>
                    )}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                    {activeSeriesObject
                      ? `Viewing official collectible chibi cards from ${activeSeriesObject.title} (${activeSeriesObject.japaneseTitle}). Featuring sound bites, expression shifts, and high-DPI transparent sticker downloads.`
                      : 'Collect 5-Star UR & 4-Star SSR anime cards, preview emotional expression shifts, listen to iconic voice bites, and export lossless PNG die-cut stickers.'}
                  </p>

                  {/* Active series reset helper */}
                  {selectedSeriesId && (
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedSeriesId(null)}
                        className="text-xs text-cyan-300 hover:text-white underline font-medium flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Show all 10 anime series</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Interactive Actions Strip */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => setActiveTab('generator')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 shadow-md shadow-purple-600/30 hover:shadow-cyan-500/25 hover:brightness-110 transition-all active:scale-95"
                  >
                    <Wand2 className="w-4 h-4 text-cyan-200" />
                    <span>Generate Chibi</span>
                  </button>

                  <button
                    onClick={() => setIsGachaOpen(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-600/30 hover:shadow-cyan-500/25 hover:brightness-110 transition-all active:scale-95"
                  >
                    <Dices className="w-4 h-4 text-cyan-200" />
                    <span>Gacha Drop</span>
                  </button>

                  <button
                    onClick={() => handleOpenStudio()}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-cyan-200 bg-[#171e30] hover:bg-[#202a45] border border-cyan-500/30 hover:border-cyan-400 transition-all active:scale-95"
                  >
                    <Palette className="w-4 h-4 text-cyan-400" />
                    <span>Sticker Studio</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Filter & View Toolbar */}
            <section className="space-y-4">
              <FilterToolbar
                searchQuery={characterSearchQuery}
                onSearchChange={setCharacterSearchQuery}
                selectedRarity={selectedRarity}
                onSelectRarity={setSelectedRarity}
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onlyFavorites={onlyFavorites}
                onToggleFavorites={() => setOnlyFavorites(!onlyFavorites)}
                totalFiltered={filteredCharacters.length}
                availableTags={allAvailableTags}
              />
            </section>

            {/* Showcase Viewport */}
            {viewMode === 'deck' ? (
              <CardDeckShowcase
                characters={filteredCharacters}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onOpenExpressions={(char) => setExpressionModalChar(char)}
                onOpenStudio={(char) => handleOpenStudio(char)}
              />
            ) : filteredCharacters.length > 0 ? (
              <div
                className={`grid gap-4 sm:gap-6 ${
                  viewMode === 'compact'
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {filteredCharacters.map((character) => (
                  <ChibiCard
                    key={character.id}
                    character={character}
                    isFavorite={favorites.has(character.id)}
                    onToggleFavorite={toggleFavorite}
                    onOpenExpressions={(char) => setExpressionModalChar(char)}
                    onOpenStudio={(char) => handleOpenStudio(char)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              /* Empty State when filters yield 0 results */
              <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto border border-purple-500/20 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-3xl">
                  🔍
                </div>
                <h3 className="text-xl font-bold font-display text-white">
                  No Chibi Cards Found
                </h3>
                <p className="text-xs text-slate-400">
                  No collectibles match your current search & filter criteria. Try adjusting your query or resetting all filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 transition-all shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-purple-500/15 bg-[#080b13] py-8 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-display text-sm tracking-tight">ChibiRealm</span>
            <span className="text-slate-600">·</span>
            <span>Interactive Anime Chibi Vault & Sticker Generator</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>10 Official Series</span>
            <span>·</span>
            <span>351 Vault Collectibles</span>
            <span>·</span>
            <span>Lossless PNG Export</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExpressionModal
        character={expressionModalChar}
        onClose={() => setExpressionModalChar(null)}
        isFavorite={expressionModalChar ? favorites.has(expressionModalChar.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      <GachaModal
        isOpen={isGachaOpen}
        onClose={() => setIsGachaOpen(false)}
        characters={characterList}
        onOpenExpressions={(char) => setExpressionModalChar(char)}
      />

      <StickerStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        characters={characterList}
        initialCharacter={studioChar}
      />
    </div>
  );
}

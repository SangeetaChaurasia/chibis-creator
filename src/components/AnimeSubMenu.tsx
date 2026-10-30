import React, { useRef } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Film } from 'lucide-react';
import { AnimeSeries } from '../types';

interface AnimeSubMenuProps {
  seriesList: AnimeSeries[];
  selectedSeriesId: string | null;
  onSelectSeries: (seriesId: string | null) => void;
  seriesSearchQuery: string;
  onSeriesSearchChange: (query: string) => void;
}

export const AnimeSubMenu: React.FC<AnimeSubMenuProps> = ({
  seriesList,
  selectedSeriesId,
  onSelectSeries,
  seriesSearchQuery,
  onSeriesSearchChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalCount = seriesList.reduce((acc, curr) => acc + curr.itemCount, 0);

  // Filtered series pills based on quick search
  const filteredSeries = seriesList.filter((s) => {
    if (!seriesSearchQuery.trim()) return true;
    const q = seriesSearchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.japaneseTitle.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q)
    );
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full border-b border-purple-500/15 bg-[#0e1322]/85 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        {/* Top row: Secondary Category Header & Series Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/25">
              <Film className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-purple-300 font-display">
                Anime Universe Vault
              </span>
              <p className="text-[12px] text-slate-400">
                Explore by franchise · {seriesList.length} Official Series · {totalCount} Collectibles
              </p>
            </div>
          </div>

          {/* Anime Series Search Box with instant clear */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/70 pointer-events-none" />
            <input
              type="text"
              value={seriesSearchQuery}
              onChange={(e) => onSeriesSearchChange(e.target.value)}
              placeholder="Search anime series (e.g. Frieren, Spy x Family, Jujutsu Kaisen)..."
              className="w-full pl-9 pr-9 py-2 text-xs rounded-full bg-[#0b0f19]/90 border border-purple-500/25 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
            {seriesSearchQuery && (
              <button
                onClick={() => onSeriesSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom row: 10-Anime Series Horizontal Pill List with live item counts */}
        <div className="relative flex items-center">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex items-center justify-center absolute -left-3 z-10 w-7 h-7 rounded-full bg-[#131a2a] text-slate-300 border border-purple-500/30 hover:border-cyan-400 hover:text-white shadow-md hover:scale-105 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Horizontal Pill Track */}
          <div
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto py-1 px-1 custom-scrollbar scroll-smooth w-full"
          >
            {/* "All Anime" master pill */}
            <button
              onClick={() => onSelectSeries(null)}
              className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                selectedSeriesId === null
                  ? 'bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-cyan-500/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-[#131a2a]/70 border-slate-700/60 text-slate-300 hover:border-purple-400/50 hover:text-white hover:bg-[#1a2236]'
              }`}
            >
              <span className="text-sm">🌐</span>
              <span>All Anime</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                  selectedSeriesId === null
                    ? 'bg-cyan-400 text-[#0b0f19]'
                    : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {totalCount}
              </span>
            </button>

            {/* 10 Individual Series Pills */}
            {filteredSeries.map((series) => {
              const isSelected = selectedSeriesId === series.id;
              return (
                <button
                  key={series.id}
                  onClick={() => onSelectSeries(isSelected ? null : series.id)}
                  className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600/30 to-cyan-500/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-[#131a2a]/70 border-slate-700/60 text-slate-300 hover:border-purple-400/50 hover:text-white hover:bg-[#1a2236]'
                  }`}
                >
                  <span className="text-sm">{series.icon}</span>
                  <span>{series.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums transition-colors ${
                      isSelected
                        ? 'bg-cyan-400 text-[#0b0f19]'
                        : 'bg-slate-800/90 text-purple-300 group-hover:bg-purple-900/60 group-hover:text-white'
                    }`}
                  >
                    {series.itemCount}
                  </span>
                </button>
              );
            })}

            {filteredSeries.length === 0 && (
              <div className="text-xs text-slate-400 py-1.5 px-3 italic">
                No anime series found matching &ldquo;{seriesSearchQuery}&rdquo;
              </div>
            )}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll('right')}
            className="hidden sm:flex items-center justify-center absolute -right-3 z-10 w-7 h-7 rounded-full bg-[#131a2a] text-slate-300 border border-purple-500/30 hover:border-cyan-400 hover:text-white shadow-md hover:scale-105 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

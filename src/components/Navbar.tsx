import React from 'react';
import { Sparkles, Dices, Heart, Layers } from 'lucide-react';

interface NavbarProps {
  onOpenGacha: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  favoriteCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenGacha,
  activeTab,
  setActiveTab,
  favoriteCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-500/20 bg-[#0B0F19]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('showcase')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-500 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white font-display group-hover:text-cyan-300 transition-colors">
                Chibi<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400">Realm</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4 Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab('showcase')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'showcase'
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-400 after:to-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Character Showcase
          </button>
          <button
            onClick={() => setActiveTab('series-vault')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'series-vault'
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-400 after:to-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Series Vault
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'generator'
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-400 after:to-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Chibi Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('sticker-studio')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'sticker-studio'
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-400 after:to-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sticker Studio
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-400 after:to-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoriteCount > 0 ? 'text-rose-400 fill-rose-400' : 'text-slate-400'}`} />
            <span>Favorites</span>
            {favoriteCount > 0 && (
              <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 tabular-nums">
                {favoriteCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenGacha}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 shadow-md shadow-purple-600/30 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 whitespace-nowrap"
          >
            <Dices className="w-3.5 h-3.5 text-cyan-200 group-hover:rotate-45 transition-transform duration-300" />
            <span>Random Gacha Drop</span>
          </button>
        </div>
      </div>
    </header>
  );
};

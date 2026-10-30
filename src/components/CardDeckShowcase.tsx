import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Heart, Volume2, Eye, Download, Info } from 'lucide-react';
import { ChibiCharacter } from '../types';
import { soundManager } from '../utils/audio';
import { downloadChibiSticker } from '../utils/stickerGenerator';

interface CardDeckShowcaseProps {
  characters: ChibiCharacter[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onOpenExpressions: (character: ChibiCharacter) => void;
  onOpenStudio: (character: ChibiCharacter) => void;
}

export const CardDeckShowcase: React.FC<CardDeckShowcaseProps> = ({
  characters,
  favorites,
  onToggleFavorite,
  onOpenExpressions,
  onOpenStudio,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (characters.length === 0) return null;

  const current = characters[currentIndex] || characters[0];
  const isFavorite = favorites.has(current.id);

  const prev = () => {
    setCurrentIndex((prevIdx) => (prevIdx > 0 ? prevIdx - 1 : characters.length - 1));
  };

  const next = () => {
    setCurrentIndex((prevIdx) => (prevIdx < characters.length - 1 ? prevIdx + 1 : 0));
  };

  const handlePlayVoice = () => {
    setIsPlayingAudio(true);
    soundManager.playChibiChime(current.id);
    soundManager.speakDialogue(current.catchphraseAudioText, current.id);
    setTimeout(() => setIsPlayingAudio(false), 2400);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadChibiSticker(current);
    } catch {
      // Ignored
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full py-8 flex flex-col items-center">
      {/* 3D Showcase Arena */}
      <div className="relative w-full max-w-4xl flex items-center justify-center">
        {/* Previous Button */}
        <button
          onClick={prev}
          className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-[#131a2a]/90 text-white border border-purple-500/30 hover:border-cyan-400 hover:scale-110 transition-all shadow-xl backdrop-blur-md"
          aria-label="Previous character"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Card Stage */}
        <div className="w-full max-w-xl mx-auto glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Card Ambient Glow */}
          <div
            className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-30"
            style={{
              background: current.rarity === '5-Star UR' ? '#fbbf24' : '#8b5cf6',
            }}
          />

          {/* Top Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                current.rarity === '5-Star UR'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                  : 'bg-purple-500/20 text-purple-300 border-purple-400/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              {current.rarity}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
                {current.collectorNumber}
              </span>
              <button
                onClick={() => onToggleFavorite(current.id)}
                className={`p-2 rounded-full border transition-all ${
                  isFavorite
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : 'bg-[#131a2a] border-slate-700 text-slate-400 hover:text-rose-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Character Main Portrait */}
          <div className="relative aspect-square w-full max-w-xs mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a2236] to-[#0b0f19] border border-cyan-500/25 p-4 flex items-center justify-center mb-5 shadow-2xl">
            <img
              src={current.imageUrl}
              alt={current.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] animate-chibi-float"
            />
            <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/60 border border-slate-700 text-cyan-300 backdrop-blur-md">
              {current.element} Element
            </div>
          </div>

          {/* Character Identity */}
          <div className="text-center mb-3">
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              {current.name}
            </h3>
            <p className="text-xs sm:text-sm text-cyan-300 mt-0.5">
              {current.seriesName} · {current.japaneseName}
            </p>
          </div>

          {/* Audio Catchphrase Strip */}
          <button
            onClick={handlePlayVoice}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs sm:text-sm text-purple-200 flex items-center justify-center gap-2.5 hover:bg-purple-900/40 hover:border-cyan-400 transition-all mb-4"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-cyan-300 animate-spin' : 'text-purple-300'}`} />
            <span className="italic truncate">&ldquo;{current.catchphrase}&rdquo;</span>
          </button>

          {/* Lore excerpt */}
          <p className="text-xs text-slate-300 text-center line-clamp-2 mb-5 px-2">
            {current.lore}
          </p>

          {/* Bottom Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onOpenExpressions(current)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold text-purple-200 bg-[#171e30] hover:bg-purple-900/40 border border-purple-500/30 hover:border-cyan-400 transition-all"
            >
              <Eye className="w-4 h-4 text-cyan-300" />
              <span>Explore Moods ({current.expressions.length})</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 shadow-md shadow-purple-600/30 hover:brightness-110 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Exporting...' : 'Download Sticker'}</span>
            </button>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={next}
          className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-[#131a2a]/90 text-white border border-purple-500/30 hover:border-cyan-400 hover:scale-110 transition-all shadow-xl backdrop-blur-md"
          aria-label="Next character"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Mini Thumbnails Selector */}
      <div className="flex items-center gap-2 mt-6 overflow-x-auto py-2 max-w-full px-4 custom-scrollbar">
        {characters.map((char, idx) => (
          <button
            key={char.id}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
              idx === currentIndex
                ? 'border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)] scale-110'
                : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-purple-400'
            }`}
          >
            <img
              src={char.imageUrl}
              alt={char.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

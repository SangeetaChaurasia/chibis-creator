import React, { useState } from 'react';
import { X, Volume2, Download, Sparkles, Heart, Info, Quote } from 'lucide-react';
import { ChibiCharacter, ExpressionItem } from '../types';
import { soundManager } from '../utils/audio';
import { downloadChibiSticker } from '../utils/stickerGenerator';

interface ExpressionModalProps {
  character: ChibiCharacter | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ExpressionModal: React.FC<ExpressionModalProps> = ({
  character,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!character) return null;

  const [activeExpressionIndex, setActiveExpressionIndex] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const activeExpr: ExpressionItem = character.expressions[activeExpressionIndex] || character.expressions[0];

  const handlePlayDialogue = () => {
    setIsPlayingVoice(true);
    soundManager.playChibiChime(character.id);
    soundManager.speakDialogue(activeExpr.dialogue, character.id);
    setTimeout(() => setIsPlayingVoice(false), 2400);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadChibiSticker(character, {
        showBadge: true,
        showNameplate: true,
      });
    } catch {
      // Ignored
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-purple-500/30 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Strip */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
              character.rarity === '5-Star UR'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                : 'bg-purple-500/20 text-purple-300 border-purple-400/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1" />
            {character.rarity}
          </div>

          <span className="text-xs font-mono text-cyan-300 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800">
            {character.collectorNumber}
          </span>

          <span className="text-xs text-slate-400">
            {character.seriesName} · {character.japaneseName}
          </span>

          <button
            onClick={() => onToggleFavorite(character.id)}
            className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-colors ${
              isFavorite
                ? 'bg-rose-500/25 border-rose-500/50 text-rose-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-rose-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span>{isFavorite ? 'In Favorites' : 'Add Favorite'}</span>
          </button>
        </div>

        {/* Main Content Layout: Left Art + Right Expressions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Chibi Portrait & Active Mood Halo */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a2236] to-[#0b0f19] border border-purple-500/30 flex items-center justify-center p-4 transition-all duration-300 shadow-xl"
              style={{
                boxShadow: `0 0 35px ${activeExpr.moodColor}33`,
              }}
            >
              <img
                src={character.imageUrl}
                alt={character.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              />

              {/* Mood Overlay Badge */}
              <div
                className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-md text-white border"
                style={{
                  backgroundColor: `${activeExpr.moodColor}44`,
                  borderColor: activeExpr.moodColor,
                }}
              >
                <span>{activeExpr.emoji}</span>
                <span>{activeExpr.name}</span>
              </div>
            </div>

            {/* Character Lore Box */}
            <div className="w-full mt-4 p-3.5 rounded-xl bg-[#0b0f19]/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-purple-300">
                <Info className="w-3.5 h-3.5" />
                <span>Character Profile</span>
              </div>
              <p className="leading-relaxed text-slate-400">{character.lore}</p>
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Scale: </span>
                  <span className="text-slate-300">{character.height}</span>
                </div>
                <div>
                  <span className="text-slate-500">Element: </span>
                  <span className="text-cyan-300">{character.element}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Expression Vault & Voice Lines */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div>
              <h3 className="text-2xl font-bold font-display text-white">{character.name}</h3>
              <p className="text-xs text-cyan-300">
                Interactive Chibi Expression Vault · Select a mood to hear voice lines
              </p>
            </div>

            {/* Expression Pill Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {character.expressions.map((expr, index) => {
                const isSelected = activeExpressionIndex === index;
                return (
                  <button
                    key={expr.id}
                    onClick={() => {
                      setActiveExpressionIndex(index);
                      soundManager.playChibiChime(character.id);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-left border transition-all duration-200 ${
                      isSelected
                        ? 'bg-purple-600/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] scale-[1.02]'
                        : 'bg-[#131a2a]/70 border-slate-700/60 text-slate-300 hover:border-purple-400/50 hover:bg-[#1a2236]'
                    }`}
                  >
                    <span className="text-xl shrink-0">{expr.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">{expr.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{expr.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Dialogue Quote Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-cyan-950/30 border border-purple-500/25 relative">
              <Quote className="w-6 h-6 text-purple-400/30 absolute top-3 right-3" />
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{activeExpr.emoji}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  {activeExpr.name} Voice Quote
                </span>
              </div>
              <p className="text-sm font-medium text-white italic pl-2 border-l-2 border-cyan-400 mb-3">
                &ldquo;{activeExpr.dialogue}&rdquo;
              </p>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePlayDialogue}
                  disabled={isPlayingVoice}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 shadow-sm transition-all active:scale-95"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingVoice ? 'animate-bounce text-cyan-300' : ''}`} />
                  <span>{isPlayingVoice ? 'Playing Catchphrase...' : 'Play Voice Line'}</span>
                </button>

                <span className="text-[11px] text-slate-400 italic">
                  {activeExpr.description}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 shadow-md shadow-purple-600/30 hover:shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Exporting Sticker...' : `Download ${character.name} Sticker PNG`}</span>
              </button>

              <button
                onClick={onClose}
                className="py-2.5 px-5 rounded-full text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

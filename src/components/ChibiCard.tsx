import React, { useState } from 'react';
import { Sparkles, Heart, Volume2, Download, Eye, Layers, Palette } from 'lucide-react';
import { ChibiCharacter } from '../types';
import { soundManager } from '../utils/audio';
import { downloadChibiSticker } from '../utils/stickerGenerator';

interface ChibiCardProps {
  character: ChibiCharacter;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenExpressions: (character: ChibiCharacter) => void;
  onOpenStudio: (character: ChibiCharacter) => void;
  viewMode?: 'grid' | 'compact';
}

export const ChibiCard: React.FC<ChibiCardProps> = ({
  character,
  isFavorite,
  onToggleFavorite,
  onOpenExpressions,
  onOpenStudio,
  viewMode = 'grid',
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [localLikes, setLocalLikes] = useState(character.likes);
  const [hasHeartBurst, setHasHeartBurst] = useState(false);

  const handlePlayVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingAudio(true);
    soundManager.playChibiChime(character.id);
    soundManager.speakDialogue(character.catchphraseAudioText, character.id);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 2400);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playHeartPop();
    setHasHeartBurst(true);
    setTimeout(() => setHasHeartBurst(false), 600);

    if (isFavorite) {
      setLocalLikes((prev) => prev - 1);
    } else {
      setLocalLikes((prev) => prev + 1);
    }
    onToggleFavorite(character.id);
  };

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      await downloadChibiSticker(character);
    } catch {
      // Handled
    } finally {
      setIsDownloading(false);
    }
  };

  // Compact sticker tile layout
  if (viewMode === 'compact') {
    return (
      <div className="glass-card rounded-2xl p-3 flex flex-col group relative overflow-hidden border border-purple-500/20 hover:border-cyan-400">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-[#171b26] to-[#0b0f19] mb-2.5">
          <img
            src={character.imageUrl}
            alt={character.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleLikeClick}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all ${
              isFavorite
                ? 'bg-rose-500/80 text-white'
                : 'bg-black/50 text-slate-300 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-black/60 text-amber-300 border border-amber-400/30">
            {character.rarity}
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 mb-1">
          <h4 className="text-sm font-bold text-white truncate font-display">{character.name}</h4>
          <span className="text-[11px] text-slate-400 tabular-nums font-mono">{localLikes}</span>
        </div>

        <p className="text-[11px] text-cyan-300/80 truncate mb-2">{character.seriesName}</p>

        <div className="grid grid-cols-2 gap-1.5 mt-auto pt-2 border-t border-purple-500/10">
          <button
            onClick={() => onOpenExpressions(character)}
            className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-[#1a2236] hover:bg-purple-600/30 text-purple-200 text-[11px] font-medium transition-colors"
          >
            <Eye className="w-3 h-3 text-cyan-300" />
            <span>Moods</span>
          </button>
          <button
            onClick={handleDownloadClick}
            disabled={isDownloading}
            className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 text-white text-[11px] font-semibold transition-all"
          >
            <Download className="w-3 h-3" />
            <span>{isDownloading ? '...' : 'PNG'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Standard Rich Collectible Card View
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col group relative overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 transition-opacity group-hover:opacity-40"
        style={{
          background: character.rarity === '5-Star UR' ? '#fbbf24' : '#8b5cf6',
        }}
      />

      {/* Card Header: Rarity Badge & Collector # & Like Metric */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {/* Rarity Badge Pill with metallic glow */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border backdrop-blur-md shadow-sm ${
            character.rarity === '5-Star UR'
              ? 'bg-amber-500/15 border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
              : 'bg-purple-500/15 border-purple-400/50 text-purple-300 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>{character.rarity}</span>
        </div>

        {/* Collector Serial & Like button */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 tracking-wider">
            {character.collectorNumber}
          </span>
          <button
            onClick={handleLikeClick}
            className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition-all duration-200 border ${
              isFavorite
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                : 'bg-[#131a2a]/80 border-slate-700/60 text-slate-400 hover:text-rose-300 hover:border-rose-400/40'
            }`}
            title="Add to favorites"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isFavorite ? 'fill-rose-400 text-rose-400 scale-110' : ''
              } ${hasHeartBurst ? 'scale-150 text-rose-400' : ''}`}
            />
            <span className="tabular-nums font-mono text-[11px]">{localLikes}</span>
          </button>
        </div>
      </div>

      {/* Chibi Character Artwork Container */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a2236]/70 via-[#131a2a]/90 to-[#0b0f19] border border-purple-500/15 flex items-center justify-center p-3 mb-3.5 group-hover:border-cyan-400/40 transition-colors">
        <img
          src={character.imageUrl}
          alt={character.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.65)] group-hover:scale-105 transition-transform duration-300"
        />

        {/* Floating Element Pill */}
        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-black/60 border border-slate-700 text-cyan-300">
          {character.element} Affinity
        </div>

        {/* Quick Expression Badge */}
        <button
          onClick={() => onOpenExpressions(character)}
          className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md bg-purple-950/70 border border-purple-500/40 text-purple-200 hover:bg-purple-900 hover:text-white transition-colors flex items-center gap-1 shadow-sm"
        >
          <Eye className="w-3 h-3 text-cyan-300" />
          <span>{character.expressions.length} Moods</span>
        </button>
      </div>

      {/* Character Identity */}
      <div className="mb-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-bold text-white font-display tracking-tight group-hover:text-cyan-300 transition-colors">
            {character.name}
          </h3>
          <span className="text-xs text-purple-300/80 font-medium whitespace-nowrap">
            {character.japaneseName}
          </span>
        </div>
        <p className="text-xs text-slate-400 truncate mt-0.5">{character.seriesName}</p>
      </div>

      {/* Iconic Catchphrase / Sound Bite Pill (Clickable Audio Player) */}
      <div className="mb-3">
        <button
          onClick={handlePlayVoice}
          className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-all duration-200 flex items-center justify-between gap-2 group/audio ${
            isPlayingAudio
              ? 'bg-gradient-to-r from-purple-900/60 to-cyan-900/60 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
              : 'bg-[#171e30]/80 border-purple-500/20 text-slate-300 hover:border-purple-400/50 hover:bg-[#1f2842]'
          }`}
          title="Click to hear iconic sound bite"
        >
          <div className="flex items-center gap-2 truncate">
            <div
              className={`p-1 rounded-full ${
                isPlayingAudio ? 'bg-cyan-400 text-black' : 'bg-purple-500/20 text-purple-300'
              }`}
            >
              <Volume2 className="w-3 h-3" />
            </div>
            <span className="truncate italic font-medium">&ldquo;{character.catchphrase}&rdquo;</span>
          </div>

          {/* Sound wave visualizer bars */}
          <div className="flex items-center gap-0.5 shrink-0 h-4">
            <span
              className={`w-0.5 rounded-full ${
                isPlayingAudio ? 'bg-cyan-300 animate-wave-1' : 'bg-slate-600 h-2'
              }`}
            />
            <span
              className={`w-0.5 rounded-full ${
                isPlayingAudio ? 'bg-cyan-300 animate-wave-2' : 'bg-slate-600 h-3'
              }`}
            />
            <span
              className={`w-0.5 rounded-full ${
                isPlayingAudio ? 'bg-cyan-300 animate-wave-3' : 'bg-slate-600 h-1.5'
              }`}
            />
          </div>
        </button>
      </div>

      {/* Personality Tags */}
      <div className="flex items-center gap-1.5 flex-wrap mb-4">
        {character.personalityTags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-400 border border-slate-800"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Quick Actions Strip */}
      <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-purple-500/15">
        <button
          onClick={() => onOpenExpressions(character)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-semibold text-purple-200 bg-[#171e30] hover:bg-purple-900/40 border border-purple-500/30 hover:border-purple-400 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-300" />
          <span>View Expressions</span>
        </button>

        <button
          onClick={handleDownloadClick}
          disabled={isDownloading}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 shadow-sm shadow-purple-600/30 hover:shadow-cyan-500/25 hover:brightness-110 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          title="Export high-resolution transparent PNG collectible sticker"
        >
          <Download className="w-3.5 h-3.5 text-cyan-100" />
          <span>{isDownloading ? 'Generating...' : 'Download PNG'}</span>
        </button>
      </div>
    </div>
  );
};

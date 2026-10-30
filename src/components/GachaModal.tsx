import React, { useState, useEffect } from 'react';
import { X, Sparkles, Dices, Eye, Download, Volume2, Star } from 'lucide-react';
import { ChibiCharacter } from '../types';
import { soundManager } from '../utils/audio';
import { downloadChibiSticker } from '../utils/stickerGenerator';

interface GachaModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: ChibiCharacter[];
  onOpenExpressions: (character: ChibiCharacter) => void;
}

export const GachaModal: React.FC<GachaModalProps> = ({
  isOpen,
  onClose,
  characters,
  onOpenExpressions,
}) => {
  if (!isOpen) return null;

  const [summoning, setSummoning] = useState(true);
  const [summonedChar, setSummonedChar] = useState<ChibiCharacter>(characters[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const pullRandom = () => {
    setSummoning(true);
    soundManager.playGachaSummon();
    const randomIndex = Math.floor(Math.random() * characters.length);
    const chosen = characters[randomIndex];

    setTimeout(() => {
      setSummonedChar(chosen);
      setSummoning(false);
      soundManager.playChibiChime(chosen.id);
    }, 1200);
  };

  useEffect(() => {
    pullRandom();
  }, []);

  const handlePlayVoice = () => {
    setIsPlayingAudio(true);
    soundManager.playChibiChime(summonedChar.id);
    soundManager.speakDialogue(summonedChar.catchphraseAudioText, summonedChar.id);
    setTimeout(() => setIsPlayingAudio(false), 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-purple-500/40 text-center text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {summoning ? (
          /* Summoning Ritual Animation */
          <div className="py-16 flex flex-col items-center justify-center space-y-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Spinning Magic Circle */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400 animate-spin" />
              <div
                className="absolute inset-2 rounded-full border border-purple-400 animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '6s' }}
              />
              <Sparkles className="w-12 h-12 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-white">
                Summoning Chibi from the Realm...
              </h3>
              <p className="text-xs text-purple-300 mt-1">Focusing anime mana waves</p>
            </div>
          </div>
        ) : (
          /* Summoned Card Reveal */
          <div className="space-y-4 animate-in zoom-in-95 duration-300">
            {/* Stars & Rarity Banner */}
            <div className="flex items-center justify-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              {summonedChar.rarity.includes('5-Star') && <Star className="w-4 h-4 fill-amber-400" />}
            </div>

            <div
              className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                summonedChar.rarity === '5-Star UR'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  : 'bg-purple-500/20 border-purple-400 text-purple-300'
              }`}
            >
              🎉 {summonedChar.rarity} DROP!
            </div>

            {/* Character Artwork */}
            <div className="relative w-56 h-56 mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a2236] to-[#0b0f19] border border-cyan-400/40 p-3 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
              <img
                src={summonedChar.imageUrl}
                alt={summonedChar.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] animate-chibi-float"
              />
            </div>

            {/* Name & Series */}
            <div>
              <h3 className="text-2xl font-bold font-display text-white">{summonedChar.name}</h3>
              <p className="text-xs text-cyan-300">
                {summonedChar.seriesName} · {summonedChar.collectorNumber}
              </p>
            </div>

            {/* Catchphrase */}
            <button
              onClick={handlePlayVoice}
              className="w-full max-w-sm mx-auto px-3.5 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 flex items-center justify-center gap-2 hover:bg-purple-900/50 transition-colors"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-cyan-300 animate-spin' : ''}`} />
              <span className="italic truncate">&ldquo;{summonedChar.catchphrase}&rdquo;</span>
            </button>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-3">
              <button
                onClick={pullRandom}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <Dices className="w-4 h-4 text-cyan-300" />
                <span>Pull Again</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenExpressions(summonedChar);
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 shadow-md shadow-purple-600/30 hover:brightness-110 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>View Expressions</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

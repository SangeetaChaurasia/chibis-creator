import React, { useState } from 'react';
import { X, Download, Sliders, Palette, Check, Sparkles } from 'lucide-react';
import { ChibiCharacter } from '../types';
import { downloadChibiSticker } from '../utils/stickerGenerator';

interface StickerStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: ChibiCharacter[];
  initialCharacter?: ChibiCharacter;
}

export const StickerStudioModal: React.FC<StickerStudioModalProps> = ({
  isOpen,
  onClose,
  characters,
  initialCharacter,
}) => {
  if (!isOpen) return null;

  const [selectedChar, setSelectedChar] = useState<ChibiCharacter>(
    initialCharacter || characters[0]
  );
  const [borderWidth, setBorderWidth] = useState(12);
  const [showBadge, setShowBadge] = useState(true);
  const [showNameplate, setShowNameplate] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadChibiSticker(selectedChar, {
        borderWidth,
        showBadge,
        showNameplate,
      });
    } catch {
      // Ignored
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto custom-scrollbar glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-purple-500/30 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
            <Palette className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Chibi Sticker Studio
            </h2>
            <p className="text-xs text-slate-400">
              Customize die-cut borders, holographic foil stamps, and export high-DPI transparent PNG stickers
            </p>
          </div>
        </div>

        {/* Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Sticker Preview */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Checkerboard transparency backdrop */}
            <div
              className="relative w-full aspect-square max-w-md rounded-2xl flex items-center justify-center p-6 border border-purple-500/25 overflow-hidden"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, #161b28 25%, transparent 25%), linear-gradient(-45deg, #161b28 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #161b28 75%), linear-gradient(-45deg, transparent 75%, #161b28 75%)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
                backgroundColor: '#0d111a',
              }}
            >
              {/* Simulated Die-Cut Sticker Object */}
              <div
                className="relative rounded-3xl transition-all duration-200 flex flex-col items-center p-4 bg-gradient-to-b from-[#131a2a] to-[#0b0f19] shadow-2xl"
                style={{
                  border: `${borderWidth}px solid #ffffff`,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(139,92,246,0.3)',
                  maxWidth: '85%',
                }}
              >
                {/* Rarity Ribbon */}
                {showBadge && (
                  <div className="absolute top-2 left-2 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black border border-white shadow-sm">
                    {selectedChar.rarity}
                  </div>
                )}

                {/* Character Render */}
                <div className="w-52 h-52 flex items-center justify-center">
                  <img
                    src={selectedChar.imageUrl}
                    alt={selectedChar.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]"
                  />
                </div>

                {/* Nameplate */}
                {showNameplate && (
                  <div className="text-center pt-2 pb-1 border-t border-purple-500/20 w-full mt-2">
                    <p className="text-sm font-bold text-white font-display">
                      {selectedChar.name}
                    </p>
                    <p className="text-[10px] text-cyan-300 font-medium">
                      {selectedChar.seriesName}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 italic">
              Preview shown with transparency grid · Exports as lossless transparent PNG
            </p>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Character Selector Grid */}
            <div>
              <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
                1. Select Chibi Character
              </label>
              <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto custom-scrollbar p-1 bg-[#0b0f19]/60 rounded-xl border border-slate-800">
                {characters.map((char) => {
                  const isChosen = char.id === selectedChar.id;
                  return (
                    <button
                      key={char.id}
                      onClick={() => setSelectedChar(char)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        isChosen
                          ? 'border-cyan-400 scale-105 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-purple-400'
                      }`}
                      title={char.name}
                    >
                      <img
                        src={char.imageUrl}
                        alt={char.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Die-Cut Border Thickness Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-purple-300 mb-1.5">
                <span>2. White Die-Cut Border</span>
                <span className="font-mono text-cyan-300 tabular-nums">{borderWidth}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                step="2"
                value={borderWidth}
                onChange={(e) => setBorderWidth(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Slim (4px)</span>
                <span>Standard (12px)</span>
                <span>Thick Manga (24px)</span>
              </div>
            </div>

            {/* Toggle Badges & Nameplate */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider">
                3. Collectible Elements
              </label>

              <button
                onClick={() => setShowBadge(!showBadge)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                  showBadge
                    ? 'bg-purple-600/25 border-cyan-400 text-white'
                    : 'bg-[#131a2a]/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Include Holographic Rarity Ribbon</span>
                </div>
                {showBadge && <Check className="w-4 h-4 text-cyan-300" />}
              </button>

              <button
                onClick={() => setShowNameplate(!showNameplate)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                  showNameplate
                    ? 'bg-purple-600/25 border-cyan-400 text-white'
                    : 'bg-[#131a2a]/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-300" />
                  <span>Include Official Series & Nameplate</span>
                </div>
                {showNameplate && <Check className="w-4 h-4 text-cyan-300" />}
              </button>
            </div>

            {/* Download Button */}
            <div className="pt-4 border-t border-purple-500/20">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-6 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 shadow-lg shadow-purple-600/30 hover:shadow-cyan-500/25 hover:brightness-110 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isDownloading
                    ? 'Rendering Lossless PNG...'
                    : `Export & Download ${selectedChar.name} Sticker`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

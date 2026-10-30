import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Volume2,
  Download,
  Eye,
  CheckCircle2,
  Shuffle,
  Layers,
  Heart,
  Palette,
  Bot,
} from 'lucide-react';
import { ChibiCharacter, ExpressionItem } from '../types';
import { soundManager } from '../utils/audio';
import { downloadChibiSticker } from '../utils/stickerGenerator';
import { synthesizeChibiVisual } from '../utils/chibiVisualSynthesizer';

interface ChibiGeneratorSectionProps {
  baseCharacters: ChibiCharacter[];
  onAddGeneratedCharacter: (newChar: ChibiCharacter) => void;
  onOpenExpressions: (character: ChibiCharacter) => void;
  onOpenStudio: (character: ChibiCharacter) => void;
}

const THEME_PRESETS = [
  { id: 'cyberpunk', name: 'Cyberpunk Neon Hacker', emoji: '🔮', color: '#06b6d4' },
  { id: 'knight', name: 'Royal Fantasy Knight', emoji: '⚔️', color: '#fbbf24' },
  { id: 'maid', name: 'Maid Cafe Barista', emoji: '🍰', color: '#f43f5e' },
  { id: 'astronaut', name: 'Space Astronaut Chibi', emoji: '🚀', color: '#818cf8' },
  { id: 'demon', name: 'Dark Sorcerer / Demon Lord', emoji: '🌙', color: '#c084fc' },
  { id: 'summer', name: 'Summer Festival Yukata', emoji: '🏖️', color: '#fb7185' },
  { id: 'winter', name: 'Cozy Winter Fluff', emoji: '☕', color: '#93c5fd' },
  { id: 'steampunk', name: 'Steampunk Airship Pilot', emoji: '⚙️', color: '#f59e0b' },
];

const MOOD_PRESETS = [
  { id: 'smug', name: 'Ultra Smug (Heh)', emoji: '😏', color: '#f43f5e' },
  { id: 'waku', name: 'Waku Waku Excitement', emoji: '✨', color: '#06b6d4' },
  { id: 'battle', name: 'Battle Mode Overpowered', emoji: '⚡', color: '#eab308' },
  { id: 'panic', name: 'Total Panic Glitch', emoji: '😱', color: '#ec4899' },
  { id: 'idol', name: 'Sweet Idol Wink', emoji: '💖', color: '#d946ef' },
  { id: 'sleepy', name: 'Sleepy Food Coma', emoji: '😴', color: '#a78bfa' },
];

const COMPANION_PRESETS = [
  { id: 'chimera', name: 'Mini Chimera', emoji: '🐲' },
  { id: 'pochita', name: 'Baby Pochita', emoji: '🐶' },
  { id: 'mimic', name: 'Mimic Chest', emoji: '📦' },
  { id: 'dragon', name: 'Tiny Dragon', emoji: '🦎' },
  { id: 'spirit', name: 'Mochi Spirit', emoji: '🍡' },
  { id: 'cat', name: 'Flying Cat', emoji: '🐱' },
];

const ELEMENTS = ['Cosmic', 'Electric', 'Magic', 'Chaos', 'Flame', 'Sound', 'Spirit', 'Wind'] as const;

export const ChibiGeneratorSection: React.FC<ChibiGeneratorSectionProps> = ({
  baseCharacters,
  onAddGeneratedCharacter,
  onOpenExpressions,
  onOpenStudio,
}) => {
  // Mode: Variant vs Fusion
  const [isFusionMode, setIsFusionMode] = useState(false);
  const [selectedBaseId, setSelectedBaseId] = useState(baseCharacters[0]?.id || 'anya-forger');
  const [selectedPartnerId, setSelectedPartnerId] = useState(baseCharacters[2]?.id || 'gojo-satoru');

  // Customization
  const [selectedTheme, setSelectedTheme] = useState(THEME_PRESETS[0].name);
  const [customTheme, setCustomTheme] = useState('');
  const [selectedMood, setSelectedMood] = useState(MOOD_PRESETS[0].name);
  const [selectedElement, setSelectedElement] = useState<(typeof ELEMENTS)[number]>('Cosmic');
  const [selectedCompanion, setSelectedCompanion] = useState(COMPANION_PRESETS[0].name);
  const [customNotes, setCustomNotes] = useState('');

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedResult, setGeneratedResult] = useState<ChibiCharacter | null>(null);
  const [hasSavedToVault, setHasSavedToVault] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const baseChar = baseCharacters.find((c) => c.id === selectedBaseId) || baseCharacters[0];
  const partnerChar = baseCharacters.find((c) => c.id === selectedPartnerId) || baseCharacters[1];

  const handleRandomize = () => {
    const randomBase = baseCharacters[Math.floor(Math.random() * baseCharacters.length)];
    const randomPartner = baseCharacters[Math.floor(Math.random() * baseCharacters.length)];
    const randomTheme = THEME_PRESETS[Math.floor(Math.random() * THEME_PRESETS.length)];
    const randomMood = MOOD_PRESETS[Math.floor(Math.random() * MOOD_PRESETS.length)];
    const randomElem = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    const randomComp = COMPANION_PRESETS[Math.floor(Math.random() * COMPANION_PRESETS.length)];

    setSelectedBaseId(randomBase.id);
    setSelectedPartnerId(randomPartner.id);
    setSelectedTheme(randomTheme.name);
    setSelectedMood(randomMood.name);
    setSelectedElement(randomElem);
    setSelectedCompanion(randomComp.name);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setHasSavedToVault(false);
    setGenerationStep('Synthesizing anime mana waves...');

    soundManager.playGachaSummon();

    const activeTheme = customTheme.trim() || selectedTheme;
    const moodObj = MOOD_PRESETS.find((m) => m.name === selectedMood) || MOOD_PRESETS[0];

    try {
      // 1. Call backend API for creative character generation
      setGenerationStep('Designing custom catchphrase & lore with Gemini...');
      let genData: Partial<ChibiCharacter> = {};

      try {
        const response = await fetch('/api/generate-chibi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            baseCharacterName: baseChar.name,
            baseSeriesName: baseChar.seriesName,
            fusionCharacterName: isFusionMode ? partnerChar.name : undefined,
            theme: activeTheme,
            mood: selectedMood,
            element: selectedElement,
            companion: selectedCompanion,
            customPrompt: customNotes.trim() || undefined,
          }),
        });

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            genData = json.data;
          }
        }
      } catch {
        // Handled via fallback
      }

      setGenerationStep('Rendering high-resolution chibi composite artwork...');

      // 2. Synthesize Composite Chibi Image
      const synthesizedImage = await synthesizeChibiVisual({
        baseImageUrl: baseChar.imageUrl,
        secondaryImageUrl: isFusionMode ? partnerChar.imageUrl : undefined,
        theme: activeTheme,
        element: selectedElement,
        companion: selectedCompanion,
        moodColor: moodObj.color,
        isFusion: isFusionMode,
      });

      // 3. Assemble New Chibi Character Object
      const randomSerialNum = Math.floor(100 + Math.random() * 900);
      const newChibi: ChibiCharacter = {
        id: `gen-${Date.now()}`,
        name:
          genData.name ||
          (isFusionMode
            ? `${baseChar.name} × ${partnerChar.name}`
            : `${activeTheme.split(' ')[0]} ${baseChar.name}`),
        japaneseName: genData.japaneseName || `${baseChar.japaneseName} (新装)`,
        seriesId: baseChar.seriesId,
        seriesName: isFusionMode
          ? `${baseChar.seriesName} + ${partnerChar.seriesName}`
          : baseChar.seriesName,
        rarity: (genData.rarity as any) || (Math.random() > 0.35 ? '5-Star UR' : '4-Star SSR'),
        catchphrase:
          genData.catchphrase ||
          (isFusionMode
            ? `Waku Waku! With combined powers, we are unstoppable!`
            : `Entering ${activeTheme}! Let us conquer the day!`),
        catchphraseAudioText:
          genData.catchphraseAudioText || `Ikimashou! Saikyou no chibi desu!`,
        personalityTags: genData.personalityTags || [
          activeTheme.split(' ')[0],
          selectedElement,
          'Custom Gen',
          'Collector Drop',
        ],
        imageUrl: synthesizedImage,
        likes: Math.floor(1200 + Math.random() * 3000),
        collectorNumber: `#GEN-${randomSerialNum}`,
        element: selectedElement,
        lore:
          genData.lore ||
          `Forged inside the ChibiRealm creation laboratory. A breathtaking ${activeTheme} fusion boasting ${selectedElement} affinity alongside ${selectedCompanion}.`,
        height: genData.height || '13 cm (Chibi scale)',
        favoriteItem: genData.favoriteItem || `${selectedCompanion} Plushie & Sweets`,
        expressions: (genData.expressions as ExpressionItem[]) || [
          {
            id: 'expr-1',
            name: selectedMood,
            emoji: moodObj.emoji,
            dialogue: `Look at this incredible ${activeTheme} gear! Pretty cool, right?`,
            moodColor: moodObj.color,
            description: 'Confident signature chibi pose',
          },
          {
            id: 'expr-2',
            name: 'Sparkle Burst',
            emoji: '✨',
            dialogue: `My ${selectedElement} power level is exceeding all expectations!`,
            moodColor: '#4cd7f6',
            description: 'Glittering with cosmic chibi particles',
          },
          {
            id: 'expr-3',
            name: 'Pouty Begging',
            emoji: '🥺',
            dialogue: 'Hey! Do not stare without giving me a snack first!',
            moodColor: '#d0bcff',
            description: 'Adorable puffed-up cheeks',
          },
          {
            id: 'expr-4',
            name: 'Victory Cheer',
            emoji: '🎉',
            dialogue: 'Heh! Mission accomplished with triple 5-star perfection!',
            moodColor: '#fbbf24',
            description: 'Raising hands in triumph',
          },
        ],
      };

      setGeneratedResult(newChibi);
      soundManager.playChibiChime(baseChar.id);
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleSaveToVault = () => {
    if (!generatedResult) return;
    onAddGeneratedCharacter(generatedResult);
    setHasSavedToVault(true);
    soundManager.playHeartPop();
  };

  const handlePlayVoice = () => {
    if (!generatedResult) return;
    setIsPlayingAudio(true);
    soundManager.playChibiChime(baseChar.id);
    soundManager.speakDialogue(generatedResult.catchphraseAudioText, baseChar.id);
    setTimeout(() => setIsPlayingAudio(false), 2400);
  };

  const handleDownload = async () => {
    if (!generatedResult) return;
    setIsDownloading(true);
    try {
      await downloadChibiSticker(generatedResult);
    } catch {
      // Ignored
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Generator Header Banner */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 overflow-hidden border border-purple-500/25">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-400/30 text-purple-200">
              <Wand2 className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Chibi Creation & Fusion Lab</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Generate New Chibis{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400">
                from Characters
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Select any anime hero as your base archetype, evolve them with cyberpunk or fantasy themes,
              or fuse two characters into an entirely new chibi with AI-crafted voice bites, expressions, and downloadable die-cut stickers!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRandomize}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-slate-300 bg-[#131a2a] hover:bg-slate-800 border border-slate-700 hover:border-purple-400 hover:text-white transition-all shadow-sm"
              title="Randomize archetype parameters"
            >
              <Shuffle className="w-3.5 h-3.5 text-cyan-300" />
              <span>Surprise Me</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Configuration + Right Live Synthesis Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column (7 cols): Configuration Form */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 border border-purple-500/20 space-y-6">
          {/* Step 1: Mode Switch (Single Variant vs Chibi Fusion) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Step 1: Creation Mode & Base Character
              </label>

              {/* Mode Toggle Button */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#0b0f19] border border-slate-800">
                <button
                  onClick={() => setIsFusionMode(false)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    !isFusionMode
                      ? 'bg-purple-600/40 text-purple-200 border border-purple-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Single Variant
                </button>
                <button
                  onClick={() => setIsFusionMode(true)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                    isFusionMode
                      ? 'bg-gradient-to-r from-purple-600/40 to-cyan-500/40 text-cyan-200 border border-cyan-400/50 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  <span>Chibi Fusion (2-in-1)</span>
                </button>
              </div>
            </div>

            {/* Base Character Selector Strip */}
            <div>
              <p className="text-[11px] text-slate-400 mb-2">
                {isFusionMode ? 'Primary Hero (Base Shape & Personality):' : 'Select Hero to Evolve:'}
              </p>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {baseCharacters.map((c) => {
                  const isSelected = c.id === selectedBaseId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedBaseId(c.id)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-1 flex items-center justify-center ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 scale-105 shadow-[0_0_12px_rgba(6,182,212,0.5)] z-10'
                          : 'border-slate-800 bg-[#131a2a]/60 opacity-60 hover:opacity-100 hover:border-purple-400'
                      }`}
                      title={`${c.name} (${c.seriesName})`}
                    >
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        className="w-full h-full object-contain filter drop-shadow-sm"
                      />
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-xs text-cyan-300 flex items-center gap-2">
                <span className="font-semibold">{baseChar.name}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{baseChar.seriesName}</span>
              </div>
            </div>

            {/* If Fusion Mode: Partner Character Selector */}
            {isFusionMode && (
              <div className="pt-3 border-t border-purple-500/15 animate-in slide-in-from-top-2 duration-200">
                <p className="text-[11px] text-purple-300 font-semibold mb-2">
                  Fusion Partner (Element & Powers):
                </p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {baseCharacters.map((c) => {
                    const isSelected = c.id === selectedPartnerId;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedPartnerId(c.id)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-1 flex items-center justify-center ${
                          isSelected
                            ? 'border-purple-400 bg-purple-950/50 scale-105 shadow-[0_0_12px_rgba(139,92,246,0.5)] z-10'
                            : 'border-slate-800 bg-[#131a2a]/60 opacity-60 hover:opacity-100 hover:border-purple-400'
                        }`}
                        title={`${c.name} (${c.seriesName})`}
                      >
                        <img
                          src={c.imageUrl}
                          alt={c.name}
                          className="w-full h-full object-contain filter drop-shadow-sm"
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs text-purple-300 flex items-center gap-2">
                  <span className="font-semibold">Fusion: {partnerChar.name}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{partnerChar.seriesName}</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Theme / Outfit Archetype */}
          <div className="space-y-3 pt-3 border-t border-purple-500/15">
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300">
              Step 2: Theme & Wardrobe Archetype
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {THEME_PRESETS.map((theme) => {
                const isSelected = selectedTheme === theme.name && !customTheme;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setSelectedTheme(theme.name);
                      setCustomTheme('');
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-purple-600/30 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                        : 'bg-[#131a2a]/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="text-lg">{theme.emoji}</span>
                    <span className="text-[11px] font-semibold truncate">{theme.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Theme Prompt Input */}
            <div className="pt-1">
              <input
                type="text"
                value={customTheme}
                onChange={(e) => setCustomTheme(e.target.value)}
                placeholder="Or type a custom theme (e.g. Cyberpunk Ninja with golden katana, Gothic Witch)..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0b0f19] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          {/* Step 3: Mood & Emotional Expression */}
          <div className="space-y-3 pt-3 border-t border-purple-500/15">
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300">
              Step 3: Signature Mood & Face Expression
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOOD_PRESETS.map((m) => {
                const isSelected = selectedMood === m.name;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.name)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-purple-600/30 border-cyan-400 text-white shadow-sm'
                        : 'bg-[#131a2a]/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{m.emoji}</span>
                    <span className="text-[11px] font-medium truncate">{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Elemental Affinity & Mascot Companion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-purple-500/15">
            {/* Element */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                Elemental Affinity
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {ELEMENTS.map((el) => {
                  const isSelected = selectedElement === el;
                  return (
                    <button
                      key={el}
                      onClick={() => setSelectedElement(el)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                          : 'bg-[#131a2a] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {el}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mascot Companion */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                Mascot Companion Pet
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {COMPANION_PRESETS.map((comp) => {
                  const isSelected = selectedCompanion === comp.name;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedCompanion(comp.name)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 ${
                        isSelected
                          ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-sm'
                          : 'bg-[#131a2a] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{comp.emoji}</span>
                      <span>{comp.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Generation Action Button */}
          <div className="pt-4 border-t border-purple-500/20">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 shadow-lg shadow-purple-600/30 hover:shadow-cyan-500/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
            >
              <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin text-cyan-200' : 'text-cyan-100'}`} />
              <span>
                {isGenerating
                  ? generationStep || 'Summoning Chibi from the Realm...'
                  : isFusionMode
                  ? `Fuse ${baseChar.name} × ${partnerChar.name}!`
                  : `Generate ${baseChar.name} Chibi Variant!`}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Live Generated Chibi Card or Placeholder */}
        <div className="lg:col-span-5">
          {generatedResult ? (
            /* Generated Chibi Result Card */
            <div className="glass-panel-elevated rounded-3xl p-6 border border-cyan-400/40 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 space-y-4">
              {/* Radial Top Glow */}
              <div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-30"
                style={{
                  background: generatedResult.rarity === '5-Star UR' ? '#fbbf24' : '#8b5cf6',
                }}
              />

              {/* Rarity & Collector Badge */}
              <div className="flex items-center justify-between">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    generatedResult.rarity === '5-Star UR'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                      : 'bg-purple-500/20 text-purple-300 border-purple-400/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{generatedResult.rarity} GENERATED DROP</span>
                </div>

                <span className="text-xs font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800">
                  {generatedResult.collectorNumber}
                </span>
              </div>

              {/* Character Visual */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a2236] to-[#0b0f19] border border-cyan-500/30 p-3 flex items-center justify-center shadow-lg group">
                <img
                  src={generatedResult.imageUrl}
                  alt={generatedResult.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] animate-chibi-float"
                />

                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/60 border border-slate-700 text-cyan-300 backdrop-blur-md">
                  {generatedResult.element} Affinity
                </div>
              </div>

              {/* Identity Details */}
              <div>
                <h3 className="text-xl font-bold font-display text-white">{generatedResult.name}</h3>
                <p className="text-xs text-cyan-300">
                  {generatedResult.seriesName} · {generatedResult.japaneseName}
                </p>
              </div>

              {/* Clickable Sound Bite */}
              <button
                onClick={handlePlayVoice}
                className="w-full p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 flex items-center justify-between gap-2 hover:bg-purple-900/40 transition-colors"
                title="Click to hear generated catchphrase"
              >
                <div className="flex items-center gap-2 truncate">
                  <Volume2 className={`w-3.5 h-3.5 shrink-0 ${isPlayingAudio ? 'text-cyan-300 animate-spin' : 'text-purple-300'}`} />
                  <span className="italic truncate">&ldquo;{generatedResult.catchphrase}&rdquo;</span>
                </div>
                <span className="text-[10px] font-bold text-cyan-300 uppercase shrink-0">Voice Line</span>
              </button>

              {/* Personality Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {generatedResult.personalityTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-300 border border-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Lore Quote */}
              <p className="text-xs text-slate-300 leading-relaxed bg-[#0b0f19]/80 p-3 rounded-xl border border-slate-800/80">
                {generatedResult.lore}
              </p>

              {/* Vault & Export Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSaveToVault}
                  disabled={hasSavedToVault}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold transition-all shadow-md ${
                    hasSavedToVault
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:brightness-110 active:scale-95'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {hasSavedToVault ? 'Added to Character Showcase!' : 'Add to My Collection & Vault'}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenExpressions(generatedResult)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-semibold text-purple-200 bg-[#171e30] hover:bg-purple-900/40 border border-purple-500/30 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-300" />
                    <span>View Moods</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloading ? '...' : 'Download PNG'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty Generator Guide / Preview Stage */
            <div className="glass-panel rounded-3xl p-8 border border-purple-500/20 text-center flex flex-col items-center justify-center min-h-[440px] space-y-4">
              <div className="relative w-24 h-24 rounded-2xl bg-[#131a2a] border border-purple-500/30 flex items-center justify-center p-3 shadow-inner">
                <img
                  src={baseChar.imageUrl}
                  alt={baseChar.name}
                  className="w-full h-full object-contain filter drop-shadow opacity-70"
                />
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-purple-600 text-white shadow-md">
                  <Wand2 className="w-3.5 h-3.5 text-cyan-300" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold font-display text-white">Chibi Synthesis Chamber</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  Ready to evolve <span className="text-cyan-300 font-semibold">{baseChar.name}</span> with the{' '}
                  <span className="text-purple-300 font-semibold">{customTheme || selectedTheme}</span> theme.
                </p>
              </div>

              <div className="w-full max-w-xs p-3 rounded-xl bg-[#0b0f19]/70 border border-slate-800 text-left text-xs text-slate-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Base Hero:</span>
                  <span className="text-white font-medium">{baseChar.name}</span>
                </div>
                {isFusionMode && (
                  <div className="flex justify-between">
                    <span>Fusion Partner:</span>
                    <span className="text-purple-300 font-medium">{partnerChar.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Theme:</span>
                  <span className="text-cyan-300 font-medium">{customTheme || selectedTheme}</span>
                </div>
                <div className="flex justify-between">
                  <span>Affinity:</span>
                  <span className="text-white font-medium">{selectedElement}</span>
                </div>
                <div className="flex justify-between">
                  <span>Companion:</span>
                  <span className="text-white font-medium">{selectedCompanion}</span>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 shadow-md shadow-purple-600/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-100" />
                <span>Begin Chibi Generation</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

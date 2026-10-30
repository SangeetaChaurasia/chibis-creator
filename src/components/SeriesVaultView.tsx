import React from 'react';
import { AnimeSeries, ChibiCharacter } from '../types';
import { Film, Sparkles, ArrowRight, Layers } from 'lucide-react';

interface SeriesVaultViewProps {
  seriesList: AnimeSeries[];
  characters: ChibiCharacter[];
  onSelectSeries: (seriesId: string) => void;
  onOpenExpressions: (character: ChibiCharacter) => void;
}

export const SeriesVaultView: React.FC<SeriesVaultViewProps> = ({
  seriesList,
  characters,
  onSelectSeries,
  onOpenExpressions,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/15">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Official Anime Franchises
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse all 10 registered anime worlds and their live collectible vault item inventories
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-full bg-[#131a2a] border border-purple-500/25 text-cyan-300">
          <Film className="w-3.5 h-3.5 text-purple-300" />
          <span>10 Series Registered · 351 Total Collectibles</span>
        </div>
      </div>

      {/* Grid of 10 Anime Series Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {seriesList.map((series) => {
          // Find representative chibi character for this series
          const mascot = characters.find((c) => c.seriesId === series.id);

          return (
            <div
              key={series.id}
              onClick={() => onSelectSeries(series.id)}
              className="glass-card rounded-2xl p-5 border border-purple-500/20 hover:border-cyan-400 cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                {/* Mascot Mini Portrait */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-b from-[#1a2236] to-[#0b0f19] border border-purple-500/30 shrink-0 p-1 flex items-center justify-center">
                  {mascot ? (
                    <img
                      src={mascot.imageUrl}
                      alt={mascot.name}
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-3xl">{series.icon}</span>
                  )}
                  <span className="absolute bottom-1 right-1 text-xs">{series.icon}</span>
                </div>

                {/* Series Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
                      {series.genre}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Est. {series.releaseYear}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-display truncate">
                    {series.title}
                  </h3>
                  <p className="text-xs text-purple-300 font-medium mb-2">
                    {series.japaneseTitle}
                  </p>

                  {/* Item counter */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Vault Collectibles:</span>
                    <span className="font-bold text-white bg-purple-600/30 border border-purple-500/30 px-2 py-0.5 rounded-full tabular-nums font-mono">
                      {series.itemCount} items
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-purple-500/10 text-xs">
                {mascot ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenExpressions(mascot);
                    }}
                    className="text-purple-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>Featured: {mascot.name}</span>
                    <Sparkles className="w-3 h-3 text-amber-300" />
                  </button>
                ) : (
                  <span className="text-slate-400">Standard Collection</span>
                )}

                <div className="flex items-center gap-1 text-cyan-300 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Explore Series</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

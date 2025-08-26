import React from 'react';
import { regimeColors } from '../lib/countryCodes';

interface RegimeData {
  id: string;
  label: string;
  countries: number;
  populationPct: number;
}

interface RegimeCardsProps {
  regimes: ReadonlyArray<RegimeData>;
  selectedRegime?: string;
  onRegimeClick?: (regime: string) => void;
}

export function RegimeCards({ regimes, selectedRegime, onRegimeClick }: RegimeCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {regimes.map((regime) => {
        const color = regimeColors[regime.id as keyof typeof regimeColors];
        const isSelected = selectedRegime === regime.id;
        
        return (
          <button
            key={regime.id}
            onClick={() => onRegimeClick?.(regime.id)}
            className={`
              relative p-4 rounded-lg border transition-all duration-200
              ${isSelected 
                ? 'border-white bg-white/10 shadow-lg shadow-white/5' 
                : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900'
              }
            `}
            aria-label={`${regime.label}: ${regime.countries} countries, ${regime.populationPct}% of population`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div 
                  className="inline-block w-3 h-3 rounded-full mb-2"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <h3 className="text-sm font-medium text-neutral-300">{regime.label}</h3>
              </div>
            </div>
            
            {/* Stats */}
            <div className="space-y-3">
              {/* Countries count */}
              <div>
                <div className="text-2xl font-mono font-bold text-white">
                  {regime.countries}
                </div>
                <div className="text-xs text-neutral-500">countries</div>
              </div>
              
              {/* Population bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-neutral-400">Population</span>
                  <span className="text-xs font-mono text-neutral-300">
                    {regime.populationPct}%
                  </span>
                </div>
                <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${regime.populationPct}%`,
                      backgroundColor: color,
                      opacity: 0.8
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Selection indicator */}
            {isSelected && (
              <div 
                className="absolute -inset-px rounded-lg pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, transparent 60%, ${color}44 100%)`
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

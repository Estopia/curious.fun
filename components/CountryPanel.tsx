import React from 'react';
import { CountryRow, Categories } from '../lib/democracy';
import { Sparkline } from './Sparkline';
import { regimeColors } from '../lib/countryCodes';

interface CountryPanelProps {
  country: CountryRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CountryPanel({ country, isOpen, onClose }: CountryPanelProps) {
  if (!country) return null;

  const categoryLabels: Record<keyof Categories, string> = {
    electoralProcess: 'Electoral Process',
    government: 'Government Function',
    participation: 'Political Participation',
    culture: 'Political Culture',
    liberties: 'Civil Liberties'
  };

  const regimeColor = regimeColors[country.regime as keyof typeof regimeColors];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-[#0f0f0f] border-l border-neutral-800 z-50 
          transform transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label={`Details for ${country.name}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0f0f0f]/95 backdrop-blur border-b border-neutral-800 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {country.name}
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: regimeColor }}
                  />
                  <span className="text-sm text-neutral-300 capitalize">
                    {country.regime === 'full' ? 'Full Democracy' : 
                     country.regime === 'flawed' ? 'Flawed Democracy' :
                     country.regime === 'hybrid' ? 'Hybrid Regime' :
                     'Authoritarian'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
              aria-label="Close panel"
            >
              <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overall Score */}
          <div className="bg-neutral-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-400">Democracy Score</span>
              {country.score > 0 && (
                <Sparkline 
                  value2023={country.score - Math.abs(country.rankChange) * 0.02} 
                  value2024={country.score}
                  color={regimeColor}
                />
              )}
            </div>
            <div className="text-3xl font-mono font-bold text-white">
              {country.score.toFixed(2)}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              out of 10.00
            </div>
          </div>

          {/* Ranking */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900 rounded-lg p-4">
              <span className="text-sm text-neutral-400">Global Rank</span>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {country.rankRaw || '—'}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                of 167 countries
              </div>
            </div>
            
            <div className="bg-neutral-900 rounded-lg p-4">
              <span className="text-sm text-neutral-400">Rank Change</span>
              <div className={`text-2xl font-mono font-bold mt-1 ${
                country.rankChange > 0 ? 'text-green-500' :
                country.rankChange < 0 ? 'text-red-500' :
                'text-neutral-400'
              }`}>
                {country.rankChange > 0 ? '+' : ''}{country.rankChange}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                from 2023
              </div>
            </div>
          </div>

          {/* Category Scores */}
          <div>
            <h3 className="text-sm font-medium text-neutral-400 mb-4">Category Scores</h3>
            <div className="space-y-3">
              {Object.entries(country.categories).map(([key, value]) => {
                const label = categoryLabels[key as keyof Categories];
                const percentage = (value / 10) * 100;
                
                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-300">{label}</span>
                      <span className="text-sm font-mono text-neutral-400">
                        {value.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: value >= 8 ? '#22c55e' :
                                         value >= 6 ? '#eab308' :
                                         value >= 4 ? '#fb923c' :
                                         '#ef4444'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Score Legend */}
          <div className="text-xs text-neutral-500 space-y-1 pt-4 border-t border-neutral-800">
            <div>8-10: Full democracy</div>
            <div>6-8: Flawed democracy</div>
            <div>4-6: Hybrid regime</div>
            <div>0-4: Authoritarian regime</div>
          </div>
        </div>
      </div>
    </>
  );
}

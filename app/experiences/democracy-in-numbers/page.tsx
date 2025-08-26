'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { countries, meta } from '../../../lib/democracy';
import { DemoMap } from '../../../components/DemoMap';
import { RegimeCards } from '../../../components/RegimeCards';
import { CountryPanel } from '../../../components/CountryPanel';
import { Sparkline } from '../../../components/Sparkline';
import type { CountryRow } from '../../../lib/democracy';

function DemocracyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [selectedCountry, setSelectedCountry] = useState<CountryRow | null>(null);
  const [selectedRegime, setSelectedRegime] = useState<string | undefined>(
    searchParams.get('regime') || undefined
  );
  const [hoveredCountry, setHoveredCountry] = useState<CountryRow | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'change'>('rank');
  const [searchTerm, setSearchTerm] = useState('');

  // Update URL when regime filter changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedRegime) {
      params.set('regime', selectedRegime);
    } else {
      params.delete('regime');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [selectedRegime, searchParams, router]);

  // Filter and sort countries
  const displayCountries = useMemo(() => {
    let filtered = [...countries];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply regime filter
    if (selectedRegime) {
      filtered = filtered.filter(c => c.regime === selectedRegime);
    }
    
    // Sort
    switch (sortBy) {
      case 'score':
        return filtered.sort((a, b) => b.score - a.score);
      case 'change':
        return filtered.sort((a, b) => b.rankChange - a.rankChange);
      case 'rank':
      default:
        return filtered.sort((a, b) => (a.rank || 999) - (b.rank || 999));
    }
  }, [searchTerm, selectedRegime, sortBy]);

  const handleCountryClick = (country: CountryRow) => {
    setSelectedCountry(country);
    setIsPanelOpen(true);
  };

  const handleRegimeClick = (regime: string) => {
    setSelectedRegime(prev => prev === regime ? undefined : regime);
  };

  // Calculate stats
  const stats = useMemo(() => {
    const democracies = countries.filter(c => 
      c.regime === 'full' || c.regime === 'flawed'
    ).length;
    const improved = countries.filter(c => c.rankChange > 0).length;
    const declined = countries.filter(c => c.rankChange < 0).length;
    
    return { democracies, improved, declined };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <div className="border-b border-neutral-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Democracy in Numbers</h1>
              <p className="text-neutral-400">
                Visualizing the EIU Democracy Index 2024 across 167 countries
              </p>
            </div>
            <a
              href="/"
              className="p-2 rounded-lg hover:bg-neutral-900 transition-colors"
              aria-label="Back to home"
            >
              <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
            <div className="text-sm text-neutral-400 mb-2">Global Average</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-bold">{meta.globalAverage2024}</span>
              <Sparkline 
                value2023={meta.globalAverage2023} 
                value2024={meta.globalAverage2024}
              />
            </div>
          </div>
          
          <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
            <div className="text-sm text-neutral-400 mb-2">Democracies</div>
            <div className="text-2xl font-mono font-bold">{stats.democracies}</div>
            <div className="text-xs text-neutral-500">of 167 countries</div>
          </div>
          
          <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
            <div className="text-sm text-neutral-400 mb-2">Improved</div>
            <div className="text-2xl font-mono font-bold text-green-500">↑{stats.improved}</div>
            <div className="text-xs text-neutral-500">from 2023</div>
          </div>
          
          <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
            <div className="text-sm text-neutral-400 mb-2">Declined</div>
            <div className="text-2xl font-mono font-bold text-red-500">↓{stats.declined}</div>
            <div className="text-xs text-neutral-500">from 2023</div>
          </div>
        </div>

        {/* Regime Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Regime Types</h2>
          <RegimeCards 
            regimes={meta.regimes}
            selectedRegime={selectedRegime}
            onRegimeClick={handleRegimeClick}
          />
        </div>

        {/* Map and List */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900/50 rounded-lg border border-neutral-800 overflow-hidden">
              <div className="h-[500px]">
                <DemoMap
                  countries={countries}
                  selectedCountry={selectedCountry?.name}
                  selectedRegime={selectedRegime}
                  onCountryClick={handleCountryClick}
                  onCountryHover={setHoveredCountry}
                  hoveredCountry={hoveredCountry}
                />
              </div>
            </div>
            
            {/* Map Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-neutral-400">Full Democracy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-neutral-400">Flawed Democracy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400" />
                <span className="text-neutral-400">Hybrid Regime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-neutral-400">Authoritarian</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-neutral-600" />
                <span className="text-neutral-400">No Data</span>
              </div>
            </div>
          </div>

          {/* Country List */}
          <div className="bg-neutral-900/50 rounded-lg border border-neutral-800">
            <div className="p-4 border-b border-neutral-800">
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-700"
              />
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setSortBy('rank')}
                  className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                    sortBy === 'rank' 
                      ? 'bg-neutral-700 text-white' 
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  Rank
                </button>
                <button
                  onClick={() => setSortBy('score')}
                  className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                    sortBy === 'score' 
                      ? 'bg-neutral-700 text-white' 
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  Score
                </button>
                <button
                  onClick={() => setSortBy('change')}
                  className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                    sortBy === 'change' 
                      ? 'bg-neutral-700 text-white' 
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  Change
                </button>
              </div>
            </div>
            
            <div className="h-[400px] overflow-y-auto">
              {displayCountries.map((country) => (
                <button
                  key={country.name}
                  onClick={() => handleCountryClick(country)}
                  className="w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors border-b border-neutral-800 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500 font-mono">
                          {country.rankRaw}
                        </span>
                        <span className="text-sm text-white">{country.name}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-neutral-400">
                          Score: <span className="font-mono text-neutral-300">{country.score.toFixed(2)}</span>
                        </span>
                        {country.rankChange !== 0 && (
                          <span className={`text-xs font-mono ${
                            country.rankChange > 0 ? 'text-green-500' :
                            country.rankChange < 0 ? 'text-red-500' :
                            'text-neutral-500'
                          }`}>
                            {country.rankChange > 0 ? '+' : ''}{country.rankChange}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-xs text-neutral-500">
          <p>Data from The Economist Intelligence Unit Democracy Index 2024</p>
          <p className="mt-1">Visualization by curious.fun</p>
        </div>
      </div>

      {/* Country Panel */}
      <CountryPanel 
        country={selectedCountry}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
}

export default function DemocracyInNumbers() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    }>
      <DemocracyContent />
    </Suspense>
  );
}

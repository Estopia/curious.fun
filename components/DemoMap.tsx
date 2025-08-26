import React, { useState, memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { CountryRow } from '../lib/democracy';
import { getISO3Code, normalizeCountryName, getRegimeColor } from '../lib/countryCodes';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface DemoMapProps {
  countries: CountryRow[];
  selectedCountry?: string;
  selectedRegime?: string;
  onCountryClick?: (country: CountryRow) => void;
  onCountryHover?: (country: CountryRow | null) => void;
  hoveredCountry?: CountryRow | null;
}

export const DemoMap = memo(function DemoMap({
  countries,
  selectedCountry,
  selectedRegime,
  onCountryClick,
  onCountryHover,
  hoveredCountry
}: DemoMapProps) {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  // Create a map of ISO3 codes to country data
  const countryDataMap = new Map<string, CountryRow>();
  countries.forEach(country => {
    const normalizedName = normalizeCountryName(country.name);
    const iso3 = getISO3Code(normalizedName);
    if (iso3) {
      countryDataMap.set(iso3, country);
    }
  });

  const handleMoveEnd = (position: any) => {
    setPosition(position);
  };

  return (
    <div className="relative w-full h-full bg-[#0f0f0f] rounded-lg overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 140,
          center: [0, 20]
        }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={0.5}
          maxZoom={8}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso3 = geo.properties.ISO_A3;
                const countryData = countryDataMap.get(iso3);
                const isSelected = countryData && selectedCountry === countryData.name;
                const isHovered = countryData && hoveredCountry?.name === countryData.name;
                const isFiltered = selectedRegime && countryData && countryData.regime !== selectedRegime;
                
                let fill = "#262626"; // Default neutral for countries with no data
                let opacity = 1;
                
                if (countryData) {
                  fill = getRegimeColor(countryData.regime);
                  if (isFiltered) {
                    opacity = 0.2;
                  } else if (selectedRegime) {
                    opacity = 1;
                  }
                }
                
                if (isSelected) {
                  opacity = 1;
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#0f0f0f"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        fill: fill,
                        fillOpacity: opacity,
                        stroke: "#0f0f0f",
                        strokeWidth: 0.5,
                        outline: "none",
                        transition: "all 250ms",
                        cursor: countryData ? "pointer" : "default"
                      },
                      hover: {
                        fill: fill,
                        fillOpacity: countryData ? (isFiltered ? 0.4 : 1) : opacity,
                        stroke: countryData ? "#ffffff" : "#0f0f0f",
                        strokeWidth: countryData ? (isHovered ? 2 : 1) : 0.5,
                        outline: "none",
                        cursor: countryData ? "pointer" : "default"
                      },
                      pressed: {
                        fill: fill,
                        fillOpacity: 1,
                        stroke: "#ffffff",
                        strokeWidth: 2,
                        outline: "none",
                        cursor: countryData ? "pointer" : "default"
                      }
                    }}
                    onClick={() => countryData && onCountryClick?.(countryData)}
                    onMouseEnter={() => countryData && onCountryHover?.(countryData)}
                    onMouseLeave={() => onCountryHover?.(null)}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Hover tooltip */}
      {hoveredCountry && (
        <div className="absolute bottom-4 left-4 bg-neutral-900/95 backdrop-blur border border-neutral-700 rounded-lg p-3 pointer-events-none z-20 max-w-xs">
          <div className="text-sm font-medium text-white mb-1">{hoveredCountry.name}</div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-neutral-400">Score:</span>
            <span className="font-mono text-white">{hoveredCountry.score.toFixed(2)}</span>
            <span className="text-neutral-400">Rank:</span>
            <span className="font-mono text-white">{hoveredCountry.rankRaw}</span>
          </div>
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1 z-20">
        <button
          onClick={() => setPosition(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.5, 8) }))}
          className="w-8 h-8 bg-neutral-900/90 backdrop-blur border border-neutral-700 rounded hover:bg-neutral-800 transition-colors flex items-center justify-center"
          aria-label="Zoom in"
        >
          <svg className="w-4 h-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          onClick={() => setPosition(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.5, 0.5) }))}
          className="w-8 h-8 bg-neutral-900/90 backdrop-blur border border-neutral-700 rounded hover:bg-neutral-800 transition-colors flex items-center justify-center"
          aria-label="Zoom out"
        >
          <svg className="w-4 h-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button
          onClick={() => setPosition({ coordinates: [0, 20], zoom: 1 })}
          className="w-8 h-8 bg-neutral-900/90 backdrop-blur border border-neutral-700 rounded hover:bg-neutral-800 transition-colors flex items-center justify-center"
          aria-label="Reset view"
        >
          <svg className="w-4 h-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
});

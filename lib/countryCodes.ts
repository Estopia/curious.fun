// Country name to ISO3 code mappings for react-simple-maps
// Handles variations and aliases in country names

export const countryNameToISO3: Record<string, string> = {
  // Direct mappings
  "Norway": "NOR",
  "New Zealand": "NZL",
  "Sweden": "SWE",
  "Iceland": "ISL",
  "Switzerland": "CHE",
  "Finland": "FIN",
  "Denmark": "DNK",
  "Ireland": "IRL",
  "Netherlands": "NLD",
  "Luxembourg": "LUX",
  "Australia": "AUS",
  "Taiwan": "TWN",
  "Germany": "DEU",
  "Canada": "CAN",
  "Uruguay": "URY",
  "Japan": "JPN",
  "United Kingdom": "GBR",
  "Costa Rica": "CRI",
  "Austria": "AUT",
  "Mauritius": "MUS",
  "Estonia": "EST",
  "Spain": "ESP",
  "Czech Republic": "CZE",
  "Portugal": "PRT",
  "Greece": "GRC",
  "France": "FRA",
  "Malta": "MLT",
  "United States of America": "USA",
  "Chile": "CHL",
  "Slovenia": "SVN",
  "Israel": "ISR",
  "South Korea": "KOR",
  "Latvia": "LVA",
  "Belgium": "BEL",
  "Botswana": "BWA",
  "Lithuania": "LTU",
  "Cabo Verde": "CPV",
  "Italy": "ITA",
  "Poland": "POL",
  "Cyprus": "CYP",
  "India": "IND",
  "Slovakia": "SVK",
  "South Africa": "ZAF",
  "Malaysia": "MYS",
  "Trinidad and Tobago": "TTO",
  "Timor-Leste": "TLS",
  "Panama": "PAN",
  "Suriname": "SUR",
  "Jamaica": "JAM",
  "Montenegro": "MNE",
  "Philippines": "PHL",
  "Dominican Republic": "DOM",
  "Mongolia": "MNG",
  "Argentina": "ARG",
  "Hungary": "HUN",
  "Croatia": "HRV",
  "Brazil": "BRA",
  "Namibia": "NAM",
  "Indonesia": "IDN",
  "Colombia": "COL",
  "Bulgaria": "BGR",
  "North Macedonia": "MKD",
  "Thailand": "THA",
  "Serbia": "SRB",
  "Ghana": "GHA",
  "Albania": "ALB",
  "Sri Lanka": "LKA",
  "Singapore": "SGP",
  "Guyana": "GUY",
  "Lesotho": "LSO",
  "Moldova": "MDA",
  "Romania": "ROU",
  "Papua New Guinea": "PNG",
  "Senegal": "SEN",
  "Paraguay": "PRY",
  "Malawi": "MWI",
  "Zambia": "ZMB",
  "Peru": "PER",
  "Bhutan": "BTN",
  "Liberia": "LBR",
  "Fiji": "FJI",
  "Armenia": "ARM",
  "Madagascar": "MDG",
  "Mexico": "MEX",
  "Ecuador": "ECU",
  "Tanzania": "TZA",
  "Hong Kong": "HKG",
  "Bosnia and Hercegovina": "BIH",
  "Kenya": "KEN",
  
  // Additional mappings from the data that might need them
  "Bolivia": "BOL",
  "Guatemala": "GTM",
  "Ukraine": "UKR",
  "El Salvador": "SLV",
  "Benin": "BEN",
  "Tunisia": "TUN",
  "Gambia": "GMB",
  "Honduras": "HND",
  "Bangladesh": "BGD",
  "Morocco": "MAR",
  "Mauritania": "MRT",
  "Georgia": "GEO",
  "Nepal": "NPL",
  "Côte d'Ivoire": "CIV",
  "Ivory Coast": "CIV",
  "Sierra Leone": "SLE",
  "Nigeria": "NGA",
  "Turkey": "TUR",
  "Pakistan": "PAK",
  "Uganda": "UGA",
  "Iraq": "IRQ",
  "Angola": "AGO",
  "Lebanon": "LBN",
  "Algeria": "DZA",
  "Kuwait": "KWT",
  "Burkina Faso": "BFA",
  "Zimbabwe": "ZWE",
  "Jordan": "JOR",
  "Niger": "NER",
  "Cuba": "CUB",
  "Mozambique": "MOZ",
  "Haiti": "HTI",
  "Cambodia": "KHM",
  "Kyrgyzstan": "KGZ",
  "Ethiopia": "ETH",
  "Venezuela": "VEN",
  "Nicaragua": "NIC",
  "Egypt": "EGY",
  "Oman": "OMN",
  "Qatar": "QAT",
  "Comoros": "COM",
  "Mali": "MLI",
  "Congo": "COG",
  "Republic of the Congo": "COG",
  "Democratic Republic of the Congo": "COD",
  "Democratic Republic of Congo": "COD",
  "DRC": "COD",
  "Cameroon": "CMR",
  "Togo": "TGO",
  "Kazakhstan": "KAZ",
  "United Arab Emirates": "ARE",
  "UAE": "ARE",
  "Guinea": "GIN",
  "Guinea-Bissau": "GNB",
  "Rwanda": "RWA",
  "Djibouti": "DJI",
  "Eswatini": "SWZ",
  "Swaziland": "SWZ",
  "Palestine": "PSE",
  "Gabon": "GAB",
  "Burundi": "BDI",
  "Russia": "RUS",
  "Bahrain": "BHR",
  "Azerbaijan": "AZE",
  "Vietnam": "VNM",
  "Belarus": "BLR",
  "China": "CHN",
  "Eritrea": "ERI",
  "Libya": "LBY",
  "Uzbekistan": "UZB",
  "Saudi Arabia": "SAU",
  "Tajikistan": "TJK",
  "Central African Republic": "CAF",
  "CAR": "CAF",
  "Iran": "IRN",
  "Chad": "TCD",
  "Sudan": "SDN",
  "Laos": "LAO",
  "Yemen": "YEM",
  "South Sudan": "SSD",
  "Equatorial Guinea": "GNQ",
  "Turkmenistan": "TKM",
  "Syria": "SYR",
  "Myanmar": "MMR",
  "Burma": "MMR",
  "Afghanistan": "AFG",
  "North Korea": "PRK",
  "Democratic People's Republic of Korea": "PRK",
  "DPRK": "PRK",
};

// Normalize country name for matching
export function normalizeCountryName(name: string): string {
  // Handle the specific case from the data where the first row has concatenated text
  if (name.includes("Democracy Index")) {
    // Extract the country name from the end
    const parts = name.split(" ");
    // The actual country name is at the end after "liberties"
    const countryStartIndex = parts.findIndex(p => p === "liberties") + 1;
    if (countryStartIndex > 0 && countryStartIndex < parts.length) {
      return parts.slice(countryStartIndex).join(" ");
    }
  }
  
  return name.trim()
    .replace(/^the\s+/i, '')  // Remove leading "the"
    .replace(/\s+/g, ' ')      // Normalize spaces
    .trim();
}

// Get ISO3 code for a country name
export function getISO3Code(countryName: string): string | undefined {
  const normalized = normalizeCountryName(countryName);
  
  // Direct lookup
  if (countryNameToISO3[normalized]) {
    return countryNameToISO3[normalized];
  }
  
  // Try case-insensitive lookup
  const lowerName = normalized.toLowerCase();
  for (const [key, value] of Object.entries(countryNameToISO3)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }
  
  // Special handling for common variations
  if (normalized === "USA" || normalized === "US" || normalized === "United States") {
    return "USA";
  }
  if (normalized === "UK" || normalized === "Britain") {
    return "GBR";
  }
  
  return undefined;
}

// Regime colors for map
export const regimeColors = {
  full: "#22c55e",        // green-500
  flawed: "#eab308",      // yellow-500
  hybrid: "#fb923c",      // orange-400
  authoritarian: "#ef4444", // red-500
  unknown: "#6b7280"      // gray-500
} as const;

// Get color for a regime type
export function getRegimeColor(regime: string): string {
  return regimeColors[regime as keyof typeof regimeColors] || regimeColors.unknown;
}

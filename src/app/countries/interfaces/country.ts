export interface Country {
  code: string;
  name: string;
  officialName: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  flag: string;
  flagAlt: string;
  coatOfArms: string;
  languages: string[];
  currencies: string[];
  timezones: string[];
  borders: string[];
  mapUrl: string;
}

export interface RestCountry {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  coatOfArms?: {
    png?: string;
    svg?: string;
  };
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol?: string }>;
  timezones?: string[];
  borders?: string[];
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
}

export type SearchMode = 'country' | 'capital';
export type Region = 'africa' | 'americas' | 'asia' | 'europe' | 'oceania';

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

export interface RestCountriesV5Response {
  data: {
    _demo?: {
      message: string;
      signup_url: string;
    };
    objects: RestCountryV5[];
  };
}

export interface RestCountryV5 {
  names?: {
    common?: string;
    official?: string;
  };
  codes?: {
    alpha_2?: string;
    alpha_3?: string;
  };
  capitals?: {
    name?: string;
  }[];
  region: string;
  subregion?: string;
  population: number;
  flag?: {
    url_png?: string;
    url_svg?: string;
  };
  coat_of_arms?: {
    url_png?: string;
    url_svg?: string;
  };
  languages?: {
    name?: string;
  }[];
  currencies?: {
    name?: string;
    symbol?: string;
  }[];
  timezones?: string[];
  borders?: string[];
}

export type SearchMode = 'country' | 'capital';
export type Region = 'africa' | 'americas' | 'asia' | 'europe' | 'oceania';

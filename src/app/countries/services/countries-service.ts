import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, map, of, shareReplay, tap } from 'rxjs';

import { Country, Region, RestCountriesV5Response, RestCountryV5 } from '../interfaces/country';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.restcountries.com/countries/v5';
  private readonly cache = new Map<string, Observable<Country[]>>();
  private readonly fallbackCountries$ = this.http
    .get<Country[]>('/data/countries.json')
    .pipe(shareReplay(1));

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly lastSearch = signal('');
  readonly selectedRegion = signal<Region | null>(null);
  readonly recentSearches = signal<string[]>(this.readFromStorage<string[]>('recent-searches', []));
  readonly favorites = signal<Country[]>(this.readFromStorage<Country[]>('favorite-countries', []));
  readonly favoriteCodes = computed(() => new Set(this.favorites().map((country) => country.code)));

  searchByName(term: string): Observable<Country[]> {
    const query = term.trim();
    this.rememberSearch(query);
    return this.requestCountries(
      `name:${query.toLowerCase()}`,
      `${this.apiUrl}/name?q=${encodeURIComponent(query)}&limit=25`,
      (countries) =>
        countries.filter((country) =>
          this.matchesText([country.name, country.officialName, country.code], query),
        ),
    );
  }

  searchByCapital(term: string): Observable<Country[]> {
    const query = term.trim();
    this.rememberSearch(query);
    return this.requestCountries(
      `capital:${query.toLowerCase()}`,
      `${this.apiUrl}?capitals.name=${encodeURIComponent(query)}&limit=25`,
      (countries) => countries.filter((country) => this.matchesText([country.capital], query)),
    );
  }

  searchByRegion(region: Region): Observable<Country[]> {
    this.selectedRegion.set(region);
    return this.requestCountries(
      `region:${region}`,
      `${this.apiUrl}?region=${this.toTitleCase(region)}&limit=100`,
      (countries) =>
        countries.filter((country) => country.region.toLowerCase() === this.toTitleCase(region).toLowerCase()),
    );
  }

  findByCode(code: string): Observable<Country | null> {
    const cleanCode = code.trim().toUpperCase();
    return this.requestCountries(
      `code:${cleanCode}`,
      `${this.apiUrl}/codes.alpha_3/${cleanCode}`,
      (countries) => countries.filter((country) => country.code === cleanCode),
    ).pipe(
      map((countries) => countries.at(0) ?? null),
    );
  }

  toggleFavorite(country: Country): void {
    const alreadySaved = this.favoriteCodes().has(country.code);
    const nextFavorites = alreadySaved
      ? this.favorites().filter((favorite) => favorite.code !== country.code)
      : [country, ...this.favorites()];

    this.favorites.set(nextFavorites);
    this.saveToStorage('favorite-countries', nextFavorites);
  }

  isFavorite(code: string): boolean {
    return this.favoriteCodes().has(code);
  }

  clearError(): void {
    this.errorMessage.set(null);
  }

  private requestCountries(
    key: string,
    url: string,
    fallbackFilter: (countries: Country[]) => Country[],
  ): Observable<Country[]> {
    const cachedRequest = this.cache.get(key);

    if (cachedRequest) {
      return cachedRequest;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const request$ = this.http.get<RestCountriesV5Response>(url, this.requestOptions()).pipe(
      map((response) => this.mapRestCountriesResponse(response)),
      catchError(() => this.fallbackCountries$.pipe(map(fallbackFilter))),
      map((countries) =>
        countries.sort((countryA, countryB) => countryA.name.localeCompare(countryB.name)),
      ),
      tap((countries) => {
        if (countries.length === 0) {
          this.errorMessage.set('No se encontraron paises para esta busqueda.');
        }
      }),
      finalize(() => this.loading.set(false)),
      shareReplay(1),
    );

    this.cache.set(key, request$);
    return request$;
  }

  private requestOptions(): { headers?: HttpHeaders } {
    const apiKey = this.readApiKey();

    if (!apiKey) {
      return {};
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${apiKey}`,
      }),
    };
  }

  private mapRestCountriesResponse(response: RestCountriesV5Response): Country[] {
    if (response.data._demo) {
      throw new Error('REST Countries demo key only returns sample data.');
    }

    return response.data.objects.map((country) => this.mapRestCountry(country));
  }

  private mapRestCountry(country: RestCountryV5): Country {
    const commonName = country.names?.common ?? 'Pais sin nombre';
    const alpha2 = country.codes?.alpha_2?.toLowerCase();
    const alpha3 = country.codes?.alpha_3 ?? alpha2?.toUpperCase() ?? commonName;

    return {
      code: alpha3,
      name: commonName,
      officialName: country.names?.official ?? commonName,
      capital: country.capitals?.map((capital) => capital.name).filter(Boolean).join(', ') || 'Sin capital registrada',
      region: country.region,
      subregion: country.subregion ?? 'Sin subregion',
      population: country.population,
      flag: country.flag?.url_svg || country.flag?.url_png || this.flagFallback(alpha2),
      flagAlt: `Bandera de ${commonName}`,
      coatOfArms: country.coat_of_arms?.url_svg || country.coat_of_arms?.url_png || '',
      languages: country.languages?.map((language) => language.name ?? '').filter(Boolean) ?? [],
      currencies:
        country.currencies
          ?.map((currency) => (currency.symbol ? `${currency.name} (${currency.symbol})` : (currency.name ?? '')))
          .filter(Boolean) ?? [],
      timezones: country.timezones ?? [],
      borders: country.borders ?? [],
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(commonName)}`,
    };
  }

  private rememberSearch(term: string): void {
    if (term.length < 2) {
      return;
    }

    this.lastSearch.set(term);
    const nextSearches = [term, ...this.recentSearches().filter((search) => search !== term)].slice(
      0,
      6,
    );
    this.recentSearches.set(nextSearches);
    this.saveToStorage('recent-searches', nextSearches);
  }

  private readFromStorage<T>(key: string, fallback: T): T {
    if (typeof localStorage === 'undefined') {
      return fallback;
    }

    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  private saveToStorage<T>(key: string, value: T): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  }

  private readApiKey(): string {
    if (typeof localStorage === 'undefined') {
      return '';
    }

    return localStorage.getItem('country-spa-api-key') ?? '';
  }

  private matchesText(values: string[], query: string): boolean {
    const cleanQuery = this.normalizeText(query);
    return values.some((value) => this.normalizeText(value).includes(cleanQuery));
  }

  private normalizeText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  private toTitleCase(region: Region): string {
    return `${region.charAt(0).toUpperCase()}${region.slice(1)}`;
  }

  private flagFallback(alpha2?: string): string {
    return alpha2 ? `https://flagcdn.com/${alpha2}.svg` : 'icons/icon-192x192.png';
  }
}

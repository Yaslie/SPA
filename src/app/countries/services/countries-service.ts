import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, map, of, shareReplay, tap } from 'rxjs';

import { Country, Region, RestCountry } from '../interfaces/country';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://restcountries.com/v3.1';
  private readonly cache = new Map<string, Observable<Country[]>>();

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
    return this.requestCountries(`name:${query.toLowerCase()}`, `${this.apiUrl}/name/${query}`);
  }

  searchByCapital(term: string): Observable<Country[]> {
    const query = term.trim();
    this.rememberSearch(query);
    return this.requestCountries(`capital:${query.toLowerCase()}`, `${this.apiUrl}/capital/${query}`);
  }

  searchByRegion(region: Region): Observable<Country[]> {
    this.selectedRegion.set(region);
    return this.requestCountries(`region:${region}`, `${this.apiUrl}/region/${region}`);
  }

  findByCode(code: string): Observable<Country | null> {
    const cleanCode = code.trim().toUpperCase();
    return this.requestCountries(`code:${cleanCode}`, `${this.apiUrl}/alpha/${cleanCode}`).pipe(
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

  private requestCountries(key: string, url: string): Observable<Country[]> {
    const cachedRequest = this.cache.get(key);

    if (cachedRequest) {
      return cachedRequest;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const request$ = this.http.get<RestCountry[]>(url).pipe(
      map((countries) =>
        countries
          .map((country) => this.mapRestCountry(country))
          .sort((countryA, countryB) => countryA.name.localeCompare(countryB.name)),
      ),
      tap((countries) => {
        if (countries.length === 0) {
          this.errorMessage.set('No se encontraron paises para esta busqueda.');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorMessage.set(this.getErrorMessage(error));
        return of([]);
      }),
      finalize(() => this.loading.set(false)),
      shareReplay(1),
    );

    this.cache.set(key, request$);
    return request$;
  }

  private mapRestCountry(country: RestCountry): Country {
    return {
      code: country.cca3 || country.cca2,
      name: country.name.common,
      officialName: country.name.official,
      capital: country.capital?.join(', ') ?? 'Sin capital registrada',
      region: country.region,
      subregion: country.subregion ?? 'Sin subregion',
      population: country.population,
      flag: country.flags.svg || country.flags.png,
      flagAlt: country.flags.alt ?? `Bandera de ${country.name.common}`,
      coatOfArms: country.coatOfArms?.svg || country.coatOfArms?.png || '',
      languages: Object.values(country.languages ?? {}),
      currencies: Object.values(country.currencies ?? {}).map((currency) =>
        currency.symbol ? `${currency.name} (${currency.symbol})` : currency.name,
      ),
      timezones: country.timezones ?? [],
      borders: country.borders ?? [],
      mapUrl: country.maps.googleMaps,
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

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 404) {
      return 'No encontramos resultados con esos datos.';
    }

    return 'No pudimos consultar la API de paises. Intenta de nuevo.';
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
}

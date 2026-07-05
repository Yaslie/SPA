import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, distinctUntilChanged, map, mergeMap, of, tap } from 'rxjs';

import { Country, SearchMode } from '../../interfaces/country';
import { CountriesService } from '../../services/countries-service';

@Component({
  selector: 'app-search-page',
  standalone: false,
  templateUrl: './search-page.html',
})
export class SearchPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly countriesService = inject(CountriesService);

  protected readonly mode = signal<SearchMode>('country');
  protected readonly term = signal('');
  protected readonly countries = signal<Country[]>([]);
  protected readonly title = computed(() =>
    this.mode() === 'capital' ? 'Buscar por capital' : 'Buscar por pais',
  );
  protected readonly placeholder = computed(() =>
    this.mode() === 'capital' ? 'Ejemplo: Tokyo, Lima, Ottawa' : 'Ejemplo: Mexico, Canada, Japan',
  );
  protected readonly examples = computed(() =>
    this.mode() === 'capital' ? ['Madrid', 'Buenos Aires', 'Ottawa'] : ['Mexico', 'Colombia', 'Japan'],
  );

  constructor() {
    combineLatest([
      this.route.data.pipe(
        map((data) => (data['mode'] === 'capital' ? 'capital' : 'country') as SearchMode),
      ),
      this.route.queryParamMap.pipe(map((params) => (params.get('q') ?? '').trim())),
    ])
      .pipe(
        distinctUntilChanged(
          ([previousMode, previousTerm], [currentMode, currentTerm]) =>
            previousMode === currentMode && previousTerm === currentTerm,
        ),
        tap(([mode, term]) => {
          this.mode.set(mode);
          this.term.set(term);
        }),
        mergeMap(([mode, term]) => {
          if (term.length < 2) {
            this.countriesService.clearError();
            return of([]);
          }

          return mode === 'capital'
            ? this.countriesService.searchByCapital(term)
            : this.countriesService.searchByName(term);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((countries) => this.countries.set(countries));
  }

  protected onSearch(term: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: term.trim() || null },
      queryParamsHandling: 'merge',
    });
  }

  protected toggleFavorite(country: Country): void {
    this.countriesService.toggleFavorite(country);
  }
}

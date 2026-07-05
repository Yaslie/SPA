import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, map, mergeMap, of, tap } from 'rxjs';

import { Country, Region } from '../../interfaces/country';
import { CountriesService } from '../../services/countries-service';

@Component({
  selector: 'app-region-page',
  standalone: false,
  templateUrl: './region-page.html',
})
export class RegionPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly countriesService = inject(CountriesService);

  protected readonly countries = signal<Country[]>([]);
  protected readonly selectedRegion = signal<Region | null>(null);
  protected readonly regions: { label: string; value: Region; description: string }[] = [
    { label: 'Africa', value: 'africa', description: 'Norte, centro y sur de Africa' },
    { label: 'Americas', value: 'americas', description: 'America del Norte, Centro y Sur' },
    { label: 'Asia', value: 'asia', description: 'Asia occidental, central y oriental' },
    { label: 'Europe', value: 'europe', description: 'Union Europea y paises vecinos' },
    { label: 'Oceania', value: 'oceania', description: 'Islas y territorios del Pacifico' },
  ];

  constructor() {
    this.route.queryParamMap
      .pipe(
        map((params) => this.normalizeRegion(params.get('region'))),
        distinctUntilChanged(),
        tap((region) => {
          this.selectedRegion.set(region);
          this.countriesService.clearError();
        }),
        mergeMap((region) => (region ? this.countriesService.searchByRegion(region) : of([]))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((countries) => this.countries.set(countries));
  }

  protected selectRegion(region: Region): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { region },
      queryParamsHandling: 'merge',
    });
  }

  protected toggleFavorite(country: Country): void {
    this.countriesService.toggleFavorite(country);
  }

  private normalizeRegion(region: string | null): Region | null {
    const regions: Region[] = ['africa', 'americas', 'asia', 'europe', 'oceania'];
    const cleanRegion = region?.toLowerCase();
    return regions.find((validRegion) => validRegion === cleanRegion) ?? null;
  }
}

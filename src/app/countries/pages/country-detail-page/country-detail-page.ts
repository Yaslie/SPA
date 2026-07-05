import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap, of } from 'rxjs';

import { Country } from '../../interfaces/country';
import { CountriesService } from '../../services/countries-service';

@Component({
  selector: 'app-country-detail-page',
  standalone: false,
  templateUrl: './country-detail-page.html',
})
export class CountryDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly countriesService = inject(CountriesService);
  protected readonly country = signal<Country | null>(null);

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('code') ?? ''),
        mergeMap((code) => (code ? this.countriesService.findByCode(code) : of(null))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((country) => this.country.set(country));
  }

  protected toggleFavorite(country: Country): void {
    this.countriesService.toggleFavorite(country);
  }
}

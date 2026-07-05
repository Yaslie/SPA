import { Component, inject } from '@angular/core';

import { Country } from '../../interfaces/country';
import { CountriesService } from '../../services/countries-service';

@Component({
  selector: 'app-favorites-page',
  standalone: false,
  templateUrl: './favorites-page.html',
})
export class FavoritesPage {
  protected readonly countriesService = inject(CountriesService);

  protected toggleFavorite(country: Country): void {
    this.countriesService.toggleFavorite(country);
  }
}

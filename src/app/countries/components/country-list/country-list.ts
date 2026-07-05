import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Country } from '../../interfaces/country';

@Component({
  selector: 'app-country-list',
  standalone: false,
  templateUrl: './country-list.html',
})
export class CountryList {
  @Input() countries: Country[] = [];
  @Input() favoriteCodes = new Set<string>();
  @Input() loading = false;
  @Input() emptyMessage = 'No hay paises para mostrar.';
  @Output() favoriteToggled = new EventEmitter<Country>();
}

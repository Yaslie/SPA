import { Component } from '@angular/core';

@Component({
  selector: 'app-countries-layout',
  standalone: false,
  templateUrl: './countries-layout.html',
})
export class CountriesLayout {
  protected readonly links = [
    { label: 'Inicio', path: '/countries/home' },
    { label: 'Pais', path: '/countries/by-country' },
    { label: 'Capital', path: '/countries/by-capital' },
    { label: 'Region', path: '/countries/by-region' },
    { label: 'Favoritos', path: '/countries/favorites' },
  ];
}

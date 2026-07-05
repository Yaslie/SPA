import { Component, inject } from '@angular/core';

import { CountriesService } from '../../services/countries-service';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.html',
})
export class DashboardPage {
  protected readonly countriesService = inject(CountriesService);
}

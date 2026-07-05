import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CountryList } from './components/country-list/country-list';
import { SearchBox } from './components/search-box/search-box';
import { CountriesRoutingModule } from './countries-routing-module';
import { CountryDetailPage } from './pages/country-detail-page/country-detail-page';
import { CountriesLayout } from './pages/countries-layout/countries-layout';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
import { FavoritesHelpPage } from './pages/favorites-help-page/favorites-help-page';
import { FavoritesPage } from './pages/favorites-page/favorites-page';
import { RegionPage } from './pages/region-page/region-page';
import { SearchPage } from './pages/search-page/search-page';

@NgModule({
  declarations: [
    SearchBox,
    CountryList,
    CountriesLayout,
    DashboardPage,
    SearchPage,
    RegionPage,
    CountryDetailPage,
    FavoritesPage,
    FavoritesHelpPage,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CountriesRoutingModule],
})
export class CountriesModule {}

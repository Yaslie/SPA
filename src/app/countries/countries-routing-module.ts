import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CountryDetailPage } from './pages/country-detail-page/country-detail-page';
import { CountriesLayout } from './pages/countries-layout/countries-layout';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
import { FavoritesHelpPage } from './pages/favorites-help-page/favorites-help-page';
import { FavoritesPage } from './pages/favorites-page/favorites-page';
import { RegionPage } from './pages/region-page/region-page';
import { SearchPage } from './pages/search-page/search-page';

const routes: Routes = [
  {
    path: '',
    component: CountriesLayout,
    children: [
      {
        path: 'home',
        component: DashboardPage,
        title: 'Country SPA - Inicio',
      },
      {
        path: 'by-country',
        component: SearchPage,
        title: 'Buscar paises',
        data: { mode: 'country' },
      },
      {
        path: 'by-capital',
        component: SearchPage,
        title: 'Buscar capitales',
        data: { mode: 'capital' },
      },
      {
        path: 'by-region',
        component: RegionPage,
        title: 'Paises por region',
      },
      {
        path: 'country/:code',
        component: CountryDetailPage,
        title: 'Detalle del pais',
      },
      {
        path: 'favorites',
        component: FavoritesPage,
        title: 'Paises favoritos',
        children: [
          {
            path: 'help',
            component: FavoritesHelpPage,
            title: 'Ayuda de favoritos',
          },
        ],
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountriesRoutingModule {}

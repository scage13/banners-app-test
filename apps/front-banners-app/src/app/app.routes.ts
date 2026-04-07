import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'banners',
    loadComponent: () =>
      import('./features/banners-list/banners-list.component').then(
        (m) => m.BannersListComponent,
      ),
  },
  {
    path: 'banners/:id',
    loadComponent: () =>
      import('./features/banner-details/banner-details.component').then(
        (m) => m.BannerDetailsComponent,
      ),
  },

  { path: '', redirectTo: '/banners', pathMatch: 'full' },
  { path: '**', redirectTo: '/banners', pathMatch: 'full' },
];

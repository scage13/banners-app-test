import { Route } from '@angular/router';
import { bannerDetailsResolver } from './core/resolvers/banner-details.resolver';

export const appRoutes: Route[] = [
  {
    path: 'banners',
    loadComponent: () =>
      import('./features/banners-list/banners-list.component').then(
        (m) => m.BannersListComponent,
      ),
  },
  {
    path: 'banners/create',
    loadComponent: () =>
      import('./features/create-banner/create-banner.component').then(
        (m) => m.CreateBannerComponent,
      ),
  },
  {
    path: 'banners/:id',
    resolve: { banner: bannerDetailsResolver },
    loadComponent: () =>
      import('./features/banner-details/banner-details.component').then(
        (m) => m.BannerDetailsComponent,
      ),
  },

  { path: '', redirectTo: '/banners', pathMatch: 'full' },
  { path: '**', redirectTo: '/banners', pathMatch: 'full' },
];

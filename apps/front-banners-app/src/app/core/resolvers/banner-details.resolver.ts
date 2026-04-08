import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { BannerDocument } from '@workspace/shared-types';
import { BannersService } from '../services/banners.service';
import { catchError, EMPTY } from 'rxjs';

export const bannerDetailsResolver: ResolveFn<BannerDocument> = (route) => {
  const bannersService = inject(BannersService);
  const router = inject(Router);
  const id = route.paramMap.get('id');

  if (!id) {
    throw new Error('Banner ID is missing in the route parameters');
  }

  return bannersService.getBannerDetails(id).pipe(
    catchError((error) => {
      router.navigate(['/banners']);
      return EMPTY;
    })
  );
};

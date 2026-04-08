import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BannerDocument } from '@workspace/shared-types';
import { BannersService } from '../services/banners.service';

export const bannerDetailsResolver: ResolveFn<BannerDocument> = (route) => {
  const bannersService = inject(BannersService);
  const id = route.paramMap.get('id');

  if (!id) {
    throw new Error('Banner ID is missing in the route parameters');
  }

  return bannersService.getBannerDetails(id);
};

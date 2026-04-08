import { Component, inject } from '@angular/core';
import { BannerFormComponent } from '../../shared/components/banner-form/banner-form.component';
import { BannerDocument } from '@workspace/shared-types';
import { BannersService } from '../../core/services/banners.service';
import { Router } from '@angular/router';

@Component({
  selector: 'create-banner',
  templateUrl: './create-banner.component.html',
  imports: [BannerFormComponent],
})
export class CreateBannerComponent {
  bannersService = inject(BannersService);
  router = inject(Router);

  onSubmit(event: Omit<BannerDocument, 'id'>) {
    this.bannersService.addNewBanner(event).subscribe(() => {
      this.router.navigate(['/banners']);
    })
  }

}

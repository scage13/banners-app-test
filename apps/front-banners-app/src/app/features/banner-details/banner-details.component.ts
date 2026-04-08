import { Component, inject, input, signal } from '@angular/core';
import { BannerDocument } from '@workspace/shared-types';
import { BannerFormComponent } from '../../shared/components/banner-form/banner-form.component';
import { BannersService } from '../../core/services/banners.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'banner-details',
  imports: [BannerFormComponent],
  templateUrl: './banner-details.component.html',
  styleUrls: ['./banner-details.component.scss'],
})
export class BannerDetailsComponent {
  banner = signal<BannerDocument | null>(null);

  bannersService = inject(BannersService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.banner.set(this.route.snapshot.data['banner']);
  }

  onSubmit(event: Omit<BannerDocument, 'id'>) {
    this.bannersService.updateBanner({ id: this.banner()?.id as string, ...event }).subscribe();
  }
}

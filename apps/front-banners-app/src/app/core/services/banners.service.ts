import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BannerDocument } from '@workspace/shared-types';

@Injectable({ providedIn: 'root' })
export class BannersService {
  httpClient: HttpClient = inject(HttpClient);

  getBanners(): Observable<BannerDocument[]> {
    return this.httpClient.get<BannerDocument[]>('/banners');
  }

  getBannerDetails(id: string): Observable<BannerDocument> {
    return this.httpClient.get<BannerDocument>(`/banners/${id}`);
  }

  addNewBanner(banner: Omit<BannerDocument, 'id'>): Observable<BannerDocument> {
    return this.httpClient.post<BannerDocument>('/banners', banner);
  }

  updateBanner({ id, title, image }: BannerDocument): Observable<BannerDocument> {
    const body = image ? { title, image } : { title };

    return this.httpClient.put<BannerDocument>(`/banners/${id}`, body);
  }

  deleteBanner(id: string): Observable<void> {
    return this.httpClient.delete<void>(`/banners/${id}`);
  }

}

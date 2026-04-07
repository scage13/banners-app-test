import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { BannerDocument } from '@workspace/shared-types';
import { BannersService } from '../../core/services/banners.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.scss'],
  imports: [MatIcon, MatIconButton],
})
export class BannersListComponent implements OnInit {
  banners = signal<BannerDocument[]>([]);

  bannersService = inject(BannersService);
  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.bannersService.getBanners().subscribe(banners => {
      this.banners.set(banners);
    });
  }

  editBanner(id: string) {
    console.log('edit', id);
  }

  deleteBanner(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Banner',
        message: 'Are you sure you want to delete this banner?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.bannersService.deleteBanner(id).subscribe(() => {
          this.banners.update((banners) => banners.filter((b) => b.id !== id));
        });
      }
    });
  }
}

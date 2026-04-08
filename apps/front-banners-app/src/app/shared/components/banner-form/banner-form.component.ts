import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ImageInputComponent } from '../image-input/image-input.component';
import { BannerDocument } from '@workspace/shared-types';

@Component({
  selector: 'banner-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ImageInputComponent,
  ],
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.scss'],
})
export class BannerFormComponent {
  emitSubmit = output<Omit<BannerDocument, 'id'>>();
  title = input<string>('');
  image = input<string | null>(null);
  mode = input<'create' | 'update'>('create');

  bannerForm: FormGroup;
  imageBase64 = signal<string | null>(null);

  private fb = inject(FormBuilder);

  constructor() {
    this.bannerForm = this.fb.group({
      title: ['', Validators.required],
      image: [null],
    });

    this.bannerForm
      .get('image')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.imageBase64.set(value);
      });

    effect(() => {
      const imageControl = this.bannerForm.get('image');
      if (this.mode() === 'create') {
        imageControl?.setValidators([Validators.required]);
      } else {
        imageControl?.clearValidators();
      }
      imageControl?.updateValueAndValidity();
    });

    effect(() => {
      this.bannerForm.patchValue({ title: this.title() });
    });

    effect(() => {
      if (this.image() && !this.bannerForm.get('image')?.dirty) {
        this.imageBase64.set(this.image());
      }
    });
  }

  onSubmit() {
    if (this.bannerForm.valid) {
      const formValue = { ...this.bannerForm.value };

      if (this.mode() === 'update' && !this.bannerForm.get('image')?.dirty) {
        formValue.image = '';
      }

      this.emitSubmit.emit(formValue);
    }
  }

  removeImage() {
    this.bannerForm.get('image')?.setValue(null);
  }
}

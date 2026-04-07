import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

// export const API_URL = new InjectionToken<string>('API_URL', {
//   providedIn: 'root',
//   factory: () => (window as any).API_URL || 'http://localhost:4321/api/banners',
// });
// import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ImageInputComponent } from './shared/components/image-input/image-input.component';

@Component({
  imports: [
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  appName = 'Banners App';
  year = new Date().getFullYear();
  // bannerForm: FormGroup;
  imageBase64 = signal<string | null>(null);
  // private apiUrl = inject(API_URL);

  // constructor(
  //   private fb: FormBuilder,
  //   private http: HttpClient,
  // ) {
  //   this.bannerForm = this.fb.group({
  //     title: ['', Validators.required],
  //     image: [null, Validators.required],
  //   });
  //
  //   this.bannerForm.get('image')?.valueChanges.subscribe(value => {
  //     this.imageBase64.set(value);
  //   });
  // }
  //
  // onSubmit() {
  //   if (this.bannerForm.valid) {
  //     console.log('Sending Banner Data:', this.bannerForm.value);
  //
  //     this.http.post(this.apiUrl, this.bannerForm.value).subscribe({
  //       next: (response) => {
  //         console.log('Success:', response);
  //         alert('Banner created successfully!');
  //         this.bannerForm.reset();
  //         this.imageBase64.set(null);
  //       },
  //       error: (error) => {
  //         console.error('Error:', error);
  //         alert('Failed to create banner. Check console for details.');
  //       }
  //     });
  //   } else {
  //     alert('Please fill the form correctly.');
  //   }
  // }
}

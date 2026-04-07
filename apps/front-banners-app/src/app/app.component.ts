import { Component, ChangeDetectionStrategy, signal, InjectionToken, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => (window as any).API_URL || 'http://localhost:4321/api/banners',
});
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [RouterModule, ReactiveFormsModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  bannerForm: FormGroup;
  imageBase64 = signal<string | null>(null);
  private apiUrl = inject(API_URL);

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.bannerForm = this.fb.group({
      title: ['', Validators.required],
      image: [null, Validators.required],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        this.imageBase64.set(base64String);
        this.bannerForm.patchValue({ image: base64String });
      };

      reader.onerror = (error) => {
        console.error('Error reading file: ', error);
      };

      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.bannerForm.valid) {
      console.log('Sending Banner Data:', this.bannerForm.value);

      this.http.post(this.apiUrl, this.bannerForm.value).subscribe({
        next: (response) => {
          console.log('Success:', response);
          alert('Banner created successfully!');
          this.bannerForm.reset();
          this.imageBase64.set(null);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Failed to create banner. Check console for details.');
        }
      });
    } else {
      alert('Please fill the form correctly.');
    }
  }
}

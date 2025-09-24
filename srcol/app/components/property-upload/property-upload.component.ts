import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-property-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="upload-container">
      <div class="upload-card">
        <h2>Enhance Your Property</h2>
        <p class="subtitle">Upload a property photo to enhance it with AI</p>

        <div class="alert alert-info" *ngIf="credits !== null">
          <strong>Credits remaining:</strong> {{ credits }}
        </div>

        <form (ngSubmit)="onSubmit()" #propertyForm="ngForm">
          <div class="form-group">
            <label for="title">Property Title</label>
            <input
              type="text"
              class="form-control"
              id="title"
              name="title"
              [(ngModel)]="form.title"
              required
              #title="ngModel"
              [ngClass]="{ 'is-invalid': title.invalid && (title.dirty || title.touched) }"
            >
            <div class="invalid-feedback" *ngIf="title.invalid && (title.dirty || title.touched)">
              Title is required
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description (Optional)</label>
            <textarea
              class="form-control"
              id="description"
              name="description"
              rows="3"
              [(ngModel)]="form.description"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="propertyType">Property Type</label>
            <select
              class="form-control"
              id="propertyType"
              name="propertyType"
              [(ngModel)]="form.propertyType"
              required
              #propertyType="ngModel"
              [ngClass]="{ 'is-invalid': propertyType.invalid && (propertyType.dirty || propertyType.touched) }"
            >
              <option value="">Select a property type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="commercial">Commercial Space</option>
              <option value="land">Land</option>
              <option value="other">Other</option>
            </select>
            <div class="invalid-feedback" *ngIf="propertyType.invalid && (propertyType.dirty || propertyType.touched)">
              Property type is required
            </div>
          </div>

          <div class="form-group">
            <label for="enhancementType">Enhancement Type</label>
            <select
              class="form-control"
              id="enhancementType"
              name="enhancementType"
              [(ngModel)]="form.enhancementType"
              required
              #enhancementType="ngModel"
              [ngClass]="{ 'is-invalid': enhancementType.invalid && (enhancementType.dirty || enhancementType.touched) }"
            >
              <option value="">Select enhancement type</option>
              <option value="staging">Virtual Staging</option>
              <option value="decluttering">Decluttering</option>
              <option value="renovation">Renovation</option>
              <option value="exterior">Exterior Enhancement</option>
              <option value="sky">Sky Replacement</option>
            </select>
            <div class="invalid-feedback" *ngIf="enhancementType.invalid && (enhancementType.dirty || enhancementType.touched)">
              Enhancement type is required
            </div>
          </div>

          <div class="form-group">
            <label for="enhancementStyle">Style (for staging/renovation)</label>
            <select
              class="form-control"
              id="enhancementStyle"
              name="enhancementStyle"
              [(ngModel)]="form.enhancementStyle"
            >
              <option value="">Select a style</option>
              <option value="modern">Modern</option>
              <option value="traditional">Traditional</option>
              <option value="minimalist">Minimalist</option>
              <option value="industrial">Industrial</option>
              <option value="rustic">Rustic</option>
              <option value="scandinavian">Scandinavian</option>
            </select>
          </div>

          <div class="form-group">
            <label for="file">Upload Property Photo</label>
            <div class="file-upload-container">
              <input
                type="file"
                id="file"
                (change)="onFileChange($event)"
                accept="image/*"
                #fileInput
              >
              <label for="file" class="file-label">
                <span class="file-icon">📁</span>
                <span class="file-text">{{ fileName || 'Choose a file...' }}</span>
              </label>
            </div>
            <div class="file-preview" *ngIf="previewUrl">
              <img [src]="previewUrl" alt="Preview">
            </div>
            <div class="text-danger" *ngIf="fileError">{{ fileError }}</div>
          </div>

          <div class="form-group">
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="propertyForm.invalid || !selectedFile || isUploading"
            >
              {{ isUploading ? 'Uploading...' : 'Enhance Property' }}
            </button>
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    .upload-container {
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }

    .upload-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      padding: 30px;
      width: 100%;
      max-width: 700px;
    }

    .upload-card h2 {
      color: #2a3990;
      text-align: center;
      margin-bottom: 10px;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 1rem;
    }

    textarea.form-control {
      resize: vertical;
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 5px;
    }

    .file-upload-container {
      position: relative;
      overflow: hidden;
      margin-bottom: 10px;
    }

    .file-upload-container input[type="file"] {
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .file-label {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .file-label:hover {
      background-color: #e9ecef;
    }

    .file-icon {
      margin-right: 10px;
      font-size: 1.2rem;
    }

    .file-preview {
      margin: 15px 0;
      text-align: center;
    }

    .file-preview img {
      max-width: 100%;
      max-height: 300px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .text-danger {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 5px;
    }

    .btn {
      display: block;
      width: 100%;
      padding: 12px;
      background-color: #eb5757;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn:hover:not(:disabled) {
      background-color: #d04848;
    }

    .btn:disabled {
      background-color: #f2a7a7;
      cursor: not-allowed;
    }

    .alert {
      padding: 10px 15px;
      border-radius: 5px;
      margin-top: 15px;
    }

    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .alert-info {
      background-color: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
      margin-bottom: 20px;
    }
  `
})
export class PropertyUploadComponent implements OnInit {
  form: any = {
    title: null,
    description: null,
    propertyType: null,
    enhancementType: null,
    enhancementStyle: null
  };

  selectedFile: File | null = null;
  fileName: string = '';
  previewUrl: string | ArrayBuffer | null = null;
  fileError: string = '';
  errorMessage: string = '';
  isUploading: boolean = false;
  credits: number | null = null;

  constructor(
    private propertyService: PropertyService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.tokenStorage.getUser();
    if (user && user.creditsRemaining !== undefined) {
      this.credits = user.creditsRemaining;
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.fileError = 'Only JPG and PNG files are allowed';
        this.selectedFile = null;
        this.fileName = '';
        this.previewUrl = null;
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.fileError = 'File size must be less than 5MB';
        this.selectedFile = null;
        this.fileName = '';
        this.previewUrl = null;
        return;
      }
      this.selectedFile = file;
      this.fileName = file.name;
      this.fileError = '';
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.selectedFile) {
      this.fileError = 'Please select a file to upload';
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', this.form.title);
    formData.append('description', this.form.description || '');
    formData.append('propertyType', this.form.propertyType);
    formData.append('enhancementType', this.form.enhancementType);
    formData.append('enhancementStyle', this.form.enhancementStyle || 'modern');

    this.isUploading = true;
    this.errorMessage = '';

    this.propertyService.uploadProperty(formData).subscribe({
      next: () => {
        this.isUploading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage = err?.error?.message || 'Error uploading property. Please try again.';
      }
    });
  }
}
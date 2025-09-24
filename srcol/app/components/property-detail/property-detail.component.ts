import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="property-detail-container">
      <div class="property-detail-card">
        <div class="card-header">
          <h2>{{ property?.title }}</h2>
          <p *ngIf="property?.description" class="description">{{ property?.description }}</p>
          <div class="property-meta">
            <div class="property-type">
              <span class="label">Property Type:</span>
              <span class="value">{{ formatPropertyType(property?.propertyType) }}</span>
            </div>
            <div class="enhancement-type">
              <span class="label">Enhancement:</span>
              <span class="value">{{ formatEnhancementType(property?.enhancementType) }}</span>
            </div>
            <div class="date">
              <span class="label">Created:</span>
              <span class="value">{{ property?.createdAt | date:'medium' }}</span>
            </div>
          </div>
        </div>

        <div class="comparison-container">
          <div class="comparison-header">
            <h3>Before & After Comparison</h3>
            <div class="slider-controls">
              <label for="slider">Slide to compare:</label>
              <input
                type="range"
                id="slider"
                min="0"
                max="100"
                value="50"
                class="slider"
                (input)="updateSlider($event)"
              >
            </div>
          </div>

          <div class="image-comparison">
            <div class="comparison-wrapper" #comparisonWrapper>
              <img
                [src]="'http://localhost:8080' + property?.originalImageUrl"
                alt="Original Image"
                class="original-image"
              >
              <div class="enhanced-wrapper" #enhancedWrapper>
                <img
                  [src]="'http://localhost:8080' + property?.imageUrl"
                  alt="Enhanced Image"
                  class="enhanced-image"
                >
              </div>
              <div class="slider-line" #sliderLine></div>
            </div>
            <div class="labels">
              <span class="original-label">Original</span>
              <span class="enhanced-label">Enhanced</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn btn-delete" (click)="deleteProperty()">Delete</button>
          <button class="btn btn-enhance" (click)="enhanceProperty()">Re-enhance</button>
          <button class="btn btn-back" (click)="goBack()">Back to Dashboard</button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .property-detail-container {
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }

    .property-detail-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      padding: 30px;
      width: 100%;
      max-width: 900px;
    }

    .card-header {
      margin-bottom: 30px;
    }

    .card-header h2 {
      color: #2a3990;
      margin-bottom: 10px;
    }

    .description {
      color: #666;
      margin-bottom: 20px;
    }

    .property-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 15px;
    }

    .label {
      font-weight: 600;
      color: #2a3990;
      margin-right: 5px;
    }

    .value {
      color: #666;
    }

    .comparison-container {
      margin-bottom: 30px;
    }

    .comparison-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .comparison-header h3 {
      color: #2a3990;
      margin: 0;
    }

    .slider-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .slider {
      width: 200px;
    }

    .image-comparison {
      margin-bottom: 20px;
    }

    .comparison-wrapper {
      position: relative;
      width: 100%;
      height: 400px;
      overflow: hidden;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .original-image, .enhanced-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .enhanced-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      overflow: hidden;
    }

    .slider-line {
      position: absolute;
      top: 0;
      left: 50%;
      width: 2px;
      height: 100%;
      background-color: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
      z-index: 10;
    }

    .labels {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }

    .original-label, .enhanced-label {
      background-color: #2a3990;
      color: white;
      padding: 5px 10px;
      border-radius: 3px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      justify-content: space-between;
      gap: 15px;
    }

    .btn {
      padding: 12px 20px;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      cursor: pointer;
      flex: 1;
      transition: background-color 0.3s;
    }

    .btn-delete {
      background-color: #dc3545;
      color: white;
    }

    .btn-delete:hover {
      background-color: #c82333;
    }

    .btn-enhance {
      background-color: #eb5757;
      color: white;
    }

    .btn-enhance:hover {
      background-color: #d04848;
    }

    .btn-back {
      background-color: #6c757d;
      color: white;
    }

    .btn-back:hover {
      background-color: #5a6268;
    }

    @media (max-width: 768px) {
      .comparison-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .comparison-wrapper {
        height: 300px;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `
})
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  isLoading = true;
  errorMessage = '';

  @ViewChild('enhancedWrapper') enhancedWrapper!: ElementRef;
  @ViewChild('sliderLine') sliderLine!: ElementRef;

  constructor(
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getProperty();
  }

  getProperty(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.propertyService.getProperty(id).subscribe({
      next: (property) => {
        this.property = property;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  updateSlider(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const percentage = parseInt(value);

    if (this.enhancedWrapper && this.sliderLine) {
      this.enhancedWrapper.nativeElement.style.width = `${percentage}%`;
      this.sliderLine.nativeElement.style.left = `${percentage}%`;
    }
  }

  formatPropertyType(type: string | undefined): string {
    if (!type) return '';

    const types: { [key: string]: string } = {
      'apartment': 'Apartment',
      'house': 'House',
      'commercial': 'Commercial Space',
      'land': 'Land',
      'other': 'Other'
    };

    return types[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }

  formatEnhancementType(type: string | undefined): string {
    if (!type) return '';

    const types: { [key: string]: string } = {
      'staging': 'Virtual Staging',
      'decluttering': 'Decluttering',
      'renovation': 'Renovation',
      'exterior': 'Exterior Enhancement',
      'sky': 'Sky Replacement'
    };

    return types[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }

  enhanceProperty(): void {
    if (!this.property) return;

    this.propertyService.enhanceProperty(this.property.id!).subscribe({
      next: (updatedProperty) => {
        this.property = updatedProperty;
        // Force image refresh by appending a timestamp
        if (this.property && this.property.imageUrl) {
          this.property.imageUrl += `?t=${new Date().getTime()}`;
        }
      },
      error: (error) => {
        this.errorMessage = error.message;
      }
    });
  }

  deleteProperty(): void {
    if (!this.property) return;

    if (confirm('Are you sure you want to delete this property?')) {
      this.propertyService.deleteProperty(this.property.id!).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

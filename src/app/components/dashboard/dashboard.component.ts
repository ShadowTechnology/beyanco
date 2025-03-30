import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h2>My Properties</h2>
        <div class="user-info">
          <div class="welcome-message">
            Welcome, {{ currentUser.firstName || currentUser.username }}!
          </div>
          <div class="credit-info" *ngIf="currentUser.creditsRemaining !== undefined">
            Credits: <span class="credit-count">{{ currentUser.creditsRemaining }}</span>
          </div>
        </div>
        <div class="action-buttons">
          <button class="btn btn-primary" (click)="navigateToUpload()">
            Upload New Property
          </button>
          <button class="btn btn-secondary" (click)="logout()">
            Logout
          </button>
        </div>
      </div>

      <div class="properties-container">
        <div *ngIf="isLoading" class="loading-indicator">
          Loading properties...
        </div>

        <div *ngIf="!isLoading && properties.length === 0" class="no-properties">
          <p>You haven't uploaded any properties yet.</p>
          <button class="btn btn-primary" (click)="navigateToUpload()">
            Upload Your First Property
          </button>
        </div>

        <div *ngIf="!isLoading && errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div *ngIf="!isLoading && properties.length > 0" class="property-grid">
          <div *ngFor="let property of properties" class="property-card" (click)="navigateToDetail(property.id!)">
            <div class="property-image">
              <img [src]="'http://localhost:8080' + property.imageUrl" alt="{{ property.title }}">
            </div>
            <div class="property-info">
              <h3 class="property-title">{{ property.title }}</h3>
              <div class="property-meta">
                <span class="property-type">{{ formatPropertyType(property.propertyType) }}</span>
                <span class="enhancement-type">{{ formatEnhancementType(property.enhancementType) }}</span>
              </div>
              <div class="property-date">
                {{ property.createdAt | date:'medium' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .dashboard-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      gap: 20px;
    }

    .dashboard-header h2 {
      margin: 0;
      color: #2a3990;
      font-size: 2rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .welcome-message {
      font-size: 1.1rem;
      margin-bottom: 5px;
    }

    .credit-info {
      font-size: 0.9rem;
      color: #666;
    }

    .credit-count {
      font-weight: 600;
      color: #2a3990;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #eb5757;
      color: white;
    }

    .btn-primary:hover {
      background-color: #d04848;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
    }

    .loading-indicator, .no-properties, .error-message {
      text-align: center;
      padding: 40px;
      background-color: #f8f9fa;
      border-radius: 10px;
    }

    .no-properties p {
      margin-bottom: 20px;
      color: #666;
    }

    .error-message {
      color: #dc3545;
    }

    .property-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
    }

    .property-card {
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: pointer;
      background-color: white;
    }

    .property-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    }

    .property-image {
      height: 200px;
      overflow: hidden;
    }

    .property-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }

    .property-card:hover .property-image img {
      transform: scale(1.05);
    }

    .property-info {
      padding: 15px;
    }

    .property-title {
      margin: 0 0 10px;
      color: #2a3990;
      font-size: 1.2rem;
    }

    .property-meta {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }

    .property-type, .enhancement-type {
      background-color: #f0f0f0;
      color: #666;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 0.8rem;
    }

    .property-date {
      font-size: 0.8rem;
      color: #888;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .user-info {
        order: -1;
        margin-bottom: 15px;
      }

      .action-buttons {
        width: 100%;
      }

      .btn {
        flex: 1;
      }

      .property-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }
  `
})
export class DashboardComponent implements OnInit {
  properties: Property[] = [];
  isLoading = true;
  errorMessage = '';
  currentUser: any = {};

  constructor(
    private propertyService: PropertyService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser();
    this.loadProperties();
  }

  loadProperties(): void {
    this.propertyService.getUserProperties().subscribe({
      next: (properties) => {
        this.properties = properties;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load properties. Please try again later.';
        this.isLoading = false;

        // If unauthorized, redirect to login
        if (error.status === 401) {
          this.tokenStorage.signOut();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  navigateToUpload(): void {
    this.router.navigate(['/property-upload']);
  }

  navigateToDetail(id: number): void {
    this.router.navigate(['/property', id]);
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['/login']);
  }

  formatPropertyType(type: string): string {
    const types: { [key: string]: string } = {
      'apartment': 'Apartment',
      'house': 'House',
      'commercial': 'Commercial',
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
      'exterior': 'Exterior',
      'sky': 'Sky Replacement'
    };

    return types[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Property } from '../../../models/property.model';
import { PropertyService } from '../../../services/property.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
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
    // this.currentUser = this.tokenStorage.getUser();
    // this.loadProperties();
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


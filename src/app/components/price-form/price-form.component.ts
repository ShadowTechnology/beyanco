import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PricingService } from '../../services/pricing.service';

@Component({
  selector: 'app-price-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './price-form.component.html',
  styleUrls: ['./price-form.component.css']
})
export class PriceFormComponent implements OnInit {

  id: number | null = null;

  name = '';
  price: number | null = null;
  duration = 'monthly';
  features = '';
  currency = '₹';
  credits: number | null = null;

  currencies = [
    { symbol: '$', label: 'USD' },
    { symbol: '₹', label: 'INR' },
    { symbol: '€', label: 'EUR' },
    { symbol: '£', label: 'GBP' },
    { symbol: '¥', label: 'JPY' }
  ];

  durations = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'lifetime', label: 'Lifetime' }
  ];
  active: boolean = true; // default: Active


  constructor(
    private pricingService: PricingService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.id = +idParam;
        this.loadPlan(this.id);
      }
    });
  }

  loadPlan(id: number) {
  this.pricingService.getPlan(id).subscribe({
    next: plan => {
      this.name = plan.name;
      this.price = plan.price;
      this.duration = plan.duration;
      this.currency = plan.currency || '₹';
      this.features = plan.description || '';
      this.active = plan.active; // ✅ load status
      this.credits = plan.creditsRemaining || null;
    },
    error: () => this.showError('Failed to load plan')
  });
}


  savePlan() {
    if (!this.name || !this.price) {
      this.showError('Please fill all required fields');
      return;
    }

    const payload = {
      name: this.name,
      price: this.price,
      duration: this.duration,
      description: this.features,
      currency: this.currency,
      active: this.active,
      creditsRemaining: this.credits
    };

    if (this.id) {
      this.pricingService.updatePlan(this.id, payload).subscribe({
        next: () => {
          this.showSuccess('Plan updated successfully');
          setTimeout(() => this.router.navigate(['/plans']), 1200);
        },
        error: () => this.showError('Failed to update plan')
      });
    } else {
      this.pricingService.createPlan(payload).subscribe({
        next: () => {
          this.showSuccess('Plan created successfully');
          setTimeout(() => this.router.navigate(['/plans']), 1200);
        },
        error: () => this.showError('Failed to create plan')
      });
    }
  }


  /* Snackbar helpers */
  private showSuccess(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}

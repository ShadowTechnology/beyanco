import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PricingService } from '../../services/pricing.service';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-price-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollingModule],
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})
export class PriceListComponent implements OnInit {

  plans: any[] = [];

  constructor(private pricingService: PricingService, private router: Router) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans() {
    this.pricingService.getPlans().subscribe({
      next: (data) => (this.plans = data),
      error: (err) => console.error(err)
    });
  }

  view(plan: any) {
    this.router.navigate(['/admin-dashboard/plans/view', plan.id]);
  }

  edit(plan: any) {
    this.router.navigate(['/admin-dashboard/plans/edit', plan.id]);
  }
}

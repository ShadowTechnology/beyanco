import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";

@Component({
  selector: 'app-staging-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staging-showcase.component.html',
  styleUrls: ['./staging-showcase.component.css']
})
export class StagingShowcaseComponent {

  tabs = ['Living Rooms', 'Bedrooms', 'Dining Rooms', 'Offices'];
  activeTab = 'Living Rooms';

  viewMode: 'before' | 'after' = 'after';

  gallery: any = {
    'Living Rooms': {
      before: 'assets/beforeimages/A1.jpg',
      after: 'assets/afterimages/A1-1.png'
    },
    'Bedrooms': {
      before: 'assets/beforeimages/A4.jpg',
      after: 'assets/afterimages/A4-4.png'
    },
    'Dining Rooms': {
      before: 'assets/beforeimages/A9.jpg',
      after: 'assets/afterimages/A9-9.jpg'
    },
    'Offices': {
      before: 'assets/beforeimages/A7.jpg',
      after: 'assets/afterimages/A7-7.jpg'
    }
  };
  constructor(private router: Router) { }
  setTab(tab: string) {
    this.activeTab = tab;
    this.viewMode = 'after';
  }

  setView(mode: 'before' | 'after') {
    this.viewMode = mode;
  }

  next() {
    this.toggleView();
  }

  prev() {
    this.toggleView();
  }

  toggleView() {
    this.viewMode = this.viewMode === 'after' ? 'before' : 'after';
  }

  get currentImage() {
    return this.gallery[this.activeTab][this.viewMode];
  }
  goToChat() {
    this.router.navigate(['/chat']);
  }
  goToPricing() {
    this.router.navigate(['/home'], { fragment: 'pricing' });
  }
}


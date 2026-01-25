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
      before: 'assets/seesamples/SS 4.png',
      after: 'assets/seesamples/SS 4-4.jpg'
    },
    'Bedrooms': {
      before: 'assets/seesamples/SS 2.png',
      after: 'assets/seesamples/SS 2-2.jpg'
    },
    'Dining Rooms': {
      before: 'assets/seesamples/SS 1.png',
      after: 'assets/seesamples/SS 1-1.jpg'
    },
    'Offices': {
      before: 'assets/seesamples/SS 5.jpg',
      after: 'assets/seesamples/SS 5-5.png'
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


import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-staging-showcase',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './staging-showcase.component.html',
  styleUrls: ['./staging-showcase.component.css']
})
export class StagingShowcaseComponent {

  tabs = ['Living Rooms', 'Bedrooms', 'Dining Rooms', 'Offices', 'Exteriors', '360°'];
  activeTab = 'Living Rooms';

  viewMode: 'before' | 'after' = 'after';
  currentIndex = 0;

  // Images per tab
  gallery: any = {
    'Living Rooms': [
      { before: 'assets/images/before1.png', after: 'assets/images/before2.png' },
      { before: 'assets/images/after2.png', after: 'assets/images/after1.png' }
    ],
    'Bedrooms': [
      { before: 'assets/images/after2.png', after: 'assets/images/after1.png' }
    ]
  };

  setTab(tab: string) {
    this.activeTab = tab;
    this.currentIndex = 0; // reset slider
  }

  setView(mode: 'before' | 'after') {
    this.viewMode = mode;
  }

  next() {
    const images = this.gallery[this.activeTab];
    this.currentIndex = (this.currentIndex + 1) % images.length;
  }

  prev() {
    const images = this.gallery[this.activeTab];
    this.currentIndex =
      this.currentIndex === 0 ? images.length - 1 : this.currentIndex - 1;
  }

  get currentImage() {
    const images = this.gallery[this.activeTab];
    return images[this.currentIndex][this.viewMode];
  }
}

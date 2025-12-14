import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {

  activeTab: string = 'uploaded';

  uploadedImages: string[] = [
    'assets/images/after.webp',
    'assets/images/after1.png',
    'assets/images/after2.png'
  ];

  generatedImages: string[] = [
    'assets/dashboard/bedroom.png',
    'assets/dashboard/kitchen.jpg',
    'assets/dashboard/living-room.jpg'
  ];

  beforeAfterImages = [
    { before: 'assets/images/before1.png', after: 'assets/images/after1.png' },
    { before: 'assets/images/before2.png', after: 'assets/images/after2.png' }
  ];

  sliderValues: number[] = [];

  constructor() {
    this.sliderValues = this.beforeAfterImages.map(() => 50);
  }

  onSlider(i: number, event: any) {
    this.sliderValues[i] = +event.target.value;
  }

  previewImage: string | null = null;

  openPreview(img: string) {
    this.previewImage = img;
  }

  closePreview() {
    this.previewImage = null;
  }
}

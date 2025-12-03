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

  previewImage: string | null = null;

  openPreview(img: string) {
    this.previewImage = img;
  }

  closePreview() {
    this.previewImage = null;
  }
}

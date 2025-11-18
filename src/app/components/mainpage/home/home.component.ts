import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';
import { MatIconModule } from '@angular/material/icon';
import { HealthService } from '../../../services/HealthService.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatIconModule],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  banners = [
    { imageUrl: 'assets/images/banner1.jpg' },
    { imageUrl: 'assets/images/banner2.jpg' },
    { imageUrl: 'assets/images/banner3.jpg' }
  ];
  services = [
    { icon: 'fa-solid fa-kitchen-set', title: 'Kitchen Staging', text: 'Modern kitchen designs that showcase functionality and style.' },
    { icon: 'fa-solid fa-bed', title: 'Bedroom Styling', text: 'Create peaceful, inviting bedrooms that buyers will love.' },
    { icon: 'fa-solid fa-couch', title: 'Furniture Arrangement', text: 'Optimize your space with professional furniture placement.' },
    { icon: 'fa-solid fa-palette', title: 'Color Coordination', text: 'Expert color schemes that enhance your property\'s appeal.' },
    { icon: 'fa-solid fa-desktop', title: 'Virtual Staging', text: 'AI-powered staging for stunning visual transformations.' },
  ];
  transformations = [
    {
      title: 'Living Room Transformation',
      desc: 'From empty space to welcoming living area with modern furniture and warm styling',
      before: 'https://gravelmag.com/wp-content/uploads/2022/02/spanish-16.jpg',
      after: 'https://belleabodes.com/wp-content/uploads/2024/01/Emma-Stone-Spanish-Style-House-Living-Room-Get-the-Look-1024x682.jpg'
    },
    {
      title: 'Kitchen Renovation',
      desc: 'Complete kitchen staging with high‑end appliances and contemporary design elements',
      before: 'https://mudosikitchenandbath.com/wp-content/uploads/2023/01/Rolling-Cart.jpg',
      after: 'https://organizeddad.com/wp-content/uploads/2022/04/dl.beatsnoop.com-1649008255-3.jpg'
    }
  ];

  transformation = [
    {
      title: 'Living Room Transformation',
      desc: 'From empty space to welcoming living area with modern furniture and warm styling',
      before: 'https://gravelmag.com/wp-content/uploads/2022/02/spanish-16.jpg',
      after: 'https://belleabodes.com/wp-content/uploads/2024/01/Emma-Stone-Spanish-Style-House-Living-Room-Get-the-Look-1024x682.jpg'
    }
  ];
  

  sliderValues: number[] = this.transformations.map(() => 50);
  healthStatus: any;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private healthService: HealthService
  ) {
    // Check if user is already logged in
    // if (this.tokenStorage.getToken()) {
    //   this.router.navigate(['/dashboard']);
    // }
  }

  ngOnInit(): void {
    // this.healthService.getHealthCheck().subscribe({
    //   next: (data) => {
    //     console.log('✅ Health Check:', data);
    //     this.healthStatus = data;
    //   },
    //   error: (err) => {
    //     console.error('❌ Error fetching health check:', err);
    //   }
    // });
  }

  onSlider(index: number, e: Event) {
    const val = Number((e.target as HTMLInputElement).value);
    this.sliderValues[index] = val;
  }
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  scrollToFeatures(): void {
    const featuresElement = document.getElementById('features');
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  goToChat() {
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/chat']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  comparisonCards = [
    {
      title: 'Modern Kitchen Renovation',
      description: 'Complete kitchen transformation with modern appliances and elegant design',
      before: 'assets/before-kitchen.jpg',
      after: 'assets/after-kitchen.jpg'
    },
    {
      title: 'Living Room Makeover',
      description: 'Contemporary living space with premium finishes',
      before: 'assets/before-living.jpg',
      after: 'assets/after-living.jpg'
    }
  ];

  steps = [
    {
      icon: 'person', title: 'Register',
      desc: 'Create your account and tell us about your project vision',
      highlight: 'Quick 2-minute registration process'
    },
    {
      icon: 'attach_money', title: 'Pricing',
      desc: 'Get instant pricing and choose the perfect package for your needs',
      highlight: 'Transparent pricing with no hidden fees'
    },
    {
      icon: 'check_circle', title: 'Complete',
      desc: 'Our expert team brings your dream home to life',
      highlight: 'Professional execution from start to finish'
    }
  ];
}

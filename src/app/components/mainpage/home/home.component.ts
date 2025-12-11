import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';
import { MatIconModule } from '@angular/material/icon';
import { HealthService } from '../../../services/HealthService.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatIconModule, RouterLink],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentIndex = 0;
  prevIndex = -1;
  isPlaying = false;
  autoPlayInterval: any;
  banners = [
    { imageUrl: 'assets/images/banner1.jpg' },
    { imageUrl: 'assets/images/banner2.jpg' },
    { imageUrl: 'assets/images/banner3.jpg' }
  ];
  services = [
    { icon: 'fas fa-house', title: 'Living Room', text: 'Furnish your living area with contemporary fitting, exuding elegance!' },
    { icon: 'fa-solid fa-kitchen-set', title: 'Kitchen', text: 'Modern kitchen interiors, bringing style and utility to your space' },
    { icon: 'fa-solid fa-bed', title: 'Bedroom', text: 'Design cozy and comfort-oriented bedroom space' },
    { icon: 'fa-solid fa-couch', title: 'Furniture Schemes', text: "Use advanced color palettes to enhance your property's appeal"},
    { icon: 'fa-solid fa-palette', title: 'Color Coordination', text: 'Expert color schemes that enhance your property\'s appeal' },
    // { icon: 'fa-solid fa-desktop', title: 'Virtual Staging', text: 'AI-powered staging for stunning visual transformations.' },
  ];
  transformations = [
    {
      title: 'Living Room Enhancements',
      desc: 'From a vacant space to a sophisticated lounge with modern decor and warm-lit furnishings',
      before: 'https://gravelmag.com/wp-content/uploads/2022/02/spanish-16.jpg',
      after: 'https://belleabodes.com/wp-content/uploads/2024/01/Emma-Stone-Spanish-Style-House-Living-Room-Get-the-Look-1024x682.jpg'
    },
    {
      title: 'Kitchen Renovation',
      desc: 'Modular kitchen with high-end appliances and a build-in pantry.',
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

  herosectionSlider = [
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
    },
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

  sliderValues: number[] = this.transformations.map(() => 50);
  healthStatus: any;
    testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Real Estate Agent",
      company: "Premium Properties NYC",
      initials: "SM",
      rating: 5,
      message: `Beyanco transformed our listings completely. The professional staging helped us 
                sell properties 40% faster than the market average. Their attention to detail 
                and understanding of luxury aesthetics is unmatched.`
    },
    {
      name: "John Carter",
      role: "Developer",
      company: "Bright Homes",
      initials: "JC",
      rating: 5,
      message: `Amazing service! The design ideas significantly improved the customer experience.`
    },
    {
      name: "Emma Collins",
      role: "Interior Designer",
      company: "Urban Spaces",
      initials: "EC",
      rating: 4,
      message: `Very professional team. Great quality work and timely delivery.`
    },
    {
      name: "Michael Lee",
      role: "Architect",
      company: "Skyline Builders",
      initials: "ML",
      rating: 5,
      message: `The best staging team we’ve worked with. Highly recommended!`
    },
    {
      name: "Priya Sharma",
      role: "Consultant",
      company: "DesignFlow",
      initials: "PS",
      rating: 5,
      message: `Incredible creativity and attention to detail. Truly impressed!`
    }
  ];

  TestiminialCurrentIndex = 0;

  nextTestimonial() {
    this.TestiminialCurrentIndex = (this.TestiminialCurrentIndex + 1) % this.testimonials.length;
  }

  prevTestimonial() {
    this.TestiminialCurrentIndex =
      (this.TestiminialCurrentIndex - 1 + this.testimonials.length) %
      this.testimonials.length;
  }


  billingType: 'month' | 'year' = 'month';

  pricing = {
    month: [
      {
        title: 'Single simulation',
        price: '$28.5',
        features: ['One-time payment', '5 photos to redo', 'No hidden fees', 'Commercial use']
      },
      {
        title: 'Premium plan',
        price: '$32.5 /month',
        features: [
          '1 individual license',
          'Interior & exterior renovation unlimited',
          'Removal of objects unlimited',
          'Blue sky unlimited',
          'Improved quality unlimited',
          '15 photos of empty spaces furnished',
          '20 lead generations',
          'Commercial use'
        ]
      },
      {
        title: 'Minimal plan',
        price: '$18.3 /month',
        features: ['1 individual license', '10 photos to redo', 'No hidden fees', 'Commercial use']
      }
    ],
    year: [
      {
        title: 'Occasional',
        price: '$285 /year',
        features: ['One-time payment', '5 photos to redo', 'No hidden fees', 'Commercial use']
      },
      {
        title: 'Star of home staging',
        price: '$320 /year',
        features: [
          '1 individual license',
          'Unlimited renovation edits',
          'Unlimited object removal',
          'Blue sky unlimited',
          'Improved quality unlimited',
          '20 furnished photos',
          '40 lead generations',
          'Commercial use'
        ]
      },
      {
        title: 'Minimal plan',
        price: '$180 /year',
        features: ['1 individual license', '10 photos to redo', 'No hidden fees', 'Commercial use']
      }
    ]
  };


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
    this.sliderValues = this.transformations.map(() => 50);
  }
  goToTestimonialSlide(index: number) {
    this.TestiminialCurrentIndex = index;
  }
  nextSlide() {
    this.currentIndex =
      this.prevIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % this.herosectionSlider.length;
  }

  prevSlide() {
    this.prevIndex = this.currentIndex;
    this.currentIndex =
      (this.currentIndex - 1 + this.herosectionSlider.length) %
      this.herosectionSlider.length;
  }

  goToSlide(i: number) {
    this.prevIndex = this.currentIndex;
    this.currentIndex = i;
  }

  toggleAutoPlay() {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, 2000);
    } else {
      clearInterval(this.autoPlayInterval);
    }
  }

  /* Before/After drag slider */
  // onSlider(i: number, event: any) {
  //   this.sliderValues[i] = event.target.value;
  // }
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
    if (this.tokenStorage.getToken() && this.tokenStorage.getUser()) {
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
  setBilling(type: 'month' | 'year') {
    this.billingType = type;
  }
}

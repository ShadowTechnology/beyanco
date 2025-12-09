import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials-form',
  imports: [CommonModule],
  templateUrl: './testimonials-form.component.html',
  styleUrl: './testimonials-form.component.css'
})
export class TestimonialsFormComponent {
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

  currentIndex = 0;

  nextTestimonial() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prevTestimonial() {
    this.currentIndex =
      (this.currentIndex - 1 + this.testimonials.length) %
      this.testimonials.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }
}

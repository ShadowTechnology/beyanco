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
      message: `We uploaded a few basic room shots and Beyanco’s AI turned them into beautifully staged interiors that looked like they were shot by a professional photographer. Interest in our property surged immediately!`
    },
    {
      name: "John Carter",
      role: "Developer",
      company: "Bright Homes",
      initials: "JC",
      rating: 5,
      message: `The platform is intuitive, fast and produces visuals that look genuinely premium. We use the enhanced photos across MLS, Instagram and ads — and the leads keep coming.`
    },
    {
      name: "Emma Collins",
      role: "Interior Designer",
      company: "Urban Spaces",
      initials: "EC",
      rating: 4,
      message: `Beyanco allows me to quickly visualize furniture layouts, styles, and color palettes for clients before execution. The AI-generated interiors are realistic and help clients feel confident about design decisions early in the process.`
    },
    {
      name: "Michael Lee",
      role: "Architect",
      company: "Skyline Builders",
      initials: "ML",
      rating: 5,
      message: `Beyanco helps translate architectural spaces into lived-in environments that clients immediately understand. The AI visuals clearly convey scale, layout, and design intent, making presentations smoother and approvals faster.`
    },
    {
      name: "Priya Sharma",
      role: "Real Estate Consultant",
      company: "DesignFlow",
      initials: "PS",
      rating: 5,
      message: `Beyanco’s AI visuals helped our properties stand out instantly on listing platforms. Buyers could clearly visualize the space, which led to more inquiries and faster decision-making. It’s now a core part of our marketing workflow.`
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

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-testimonials-list',
  imports: [CommonModule],
  templateUrl: './testimonials-list.component.html',
  styleUrl: './testimonials-list.component.css'
})
export class TestimonialsListComponent {
  constructor(private router: Router) { }
  testimonials = [
    {
      id: 1,
      name: "John Doe",
      role: "Designer",
      company: "Beyanco AI",
      rating: 5,
      message: "Amazing service! Loved the experience!"
    },
  ];
  goTo() {
    this.router.navigate(['/testimonials-form'])
  }

}

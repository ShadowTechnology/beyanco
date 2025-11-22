import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recent-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recent-projects.component.html',
  styleUrl: './recent-projects.component.css'
})
export class RecentProjectsComponent {
  projects = [
    {
      name: 'Modern Living Room',
      image: 'assets/dashboard/bedroom.png',
      tags: ['Living Room', 'Modern'],
      date: '2 days ago',
    },
    {
      name: 'Minimalist Kitchen',
      image: 'assets/dashboard/kitchen.jpg',
      tags: ['Kitchen', 'Minimalist'],
      date: '5 days ago',
    },
    {
      name: 'Cozy Bedroom',
      image: 'assets/dashboard/bedroom.png',
      tags: ['Bedroom', 'Scandinavian'],
      date: '1 week ago',
    },
    {
      name: 'Home Office',
      image: 'assets/dashboard/living-room.jpg',
      tags: ['Office', 'Industrial'],
      date: '2 weeks ago',
    },
  ];
}

import { Component } from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects-dashboard',
  standalone: true,
  imports: [ProjectCardComponent, CommonModule],
  templateUrl: './projects-dashboard.component.html',
  styleUrl: './projects-dashboard.component.css'
})
export class ProjectsDashboardComponent {
  selectedTab = 'All';

  projects = [
    {
      title: 'Modern Living Room',
      image: 'assets/project/modern-living-room.jpg',
      tags: ['Living Room', 'Modern'],
      date: 'April 1, 2025',
      transformed: true,
      status: 'Completed'
    },
    {
      title: 'Minimalist Kitchen',
      image: 'assets/project/minimalist-kitchen.jpg',
      tags: ['Kitchen', 'Minimalist'],
      date: 'March 28, 2025',
      transformed: true,
      status: 'Completed'
    },
    {
      title: 'Cozy Bedroom',
      image: 'assets/project/cozy-bedroom.jpg',
      tags: ['Bedroom', 'Scandinavian'],
      date: 'March 25, 2025',
      transformed: true,
      status: 'Pending'
    },
    {
      title: 'Home Office',
      image: 'assets/project/modern-living-room.jpg',
      tags: ['Office', 'Industrial'],
      date: 'March 20, 2025',
      transformed: false,
      status: 'Pending'
    },
    {
      title: 'Elegant Dining Room',
      image: 'assets/project/minimalist-kitchen.jpg',
      tags: ['Dining Room', 'Traditional'],
      date: 'March 15, 2025',
      transformed: false,
      status: 'Completed'
    },
    {
      title: 'Bathroom Remodel',
      image: 'assets/project/cozy-bedroom.jpg',
      tags: ['Bathroom', 'Rustic'],
      date: 'March 10, 2025',
      transformed: true,
      status: 'Pending'
    }
  ];

  get filteredProjects() {
    if (this.selectedTab === 'All') return this.projects;
    return this.projects.filter(p => p.status === this.selectedTab);
  }
}

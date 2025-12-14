import { CommonModule } from '@angular/common';
import { RecentProjectsComponent } from '../recent-projects/recent-projects.component';
import { QuickActionsComponent } from '../quick-actions/quick-actions.component';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { ChartCardComponent } from '../chart-card/chart-card.component';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, RecentProjectsComponent, QuickActionsComponent, StatCardComponent, ChartCardComponent],
  selector: 'app-admin-dashboardcontent',
  templateUrl: './admin-dashboardcontent.component.html',
  styleUrls: ['./admin-dashboardcontent.component.css']
})
export class AdminDashboardContentComponent {
  constructor() { }
  popularStyles = [
    { label: 'Modern', value: 36 },
    { label: 'Minimal', value: 27 },
    { label: 'Rustic', value: 18 },
    { label: 'Industrial', value: 9 },
    { label: 'Bohemian', value: 0 }
  ];

  monthlyActivity = [
    { month: 'Jan', projects: 3 },
    { month: 'Feb', projects: 5 },
    { month: 'Mar', projects: 2 },
    { month: 'Apr', projects: 6 },
    { month: 'May', projects: 4 },
    { month: 'Jun', projects: 7 }
  ];

}

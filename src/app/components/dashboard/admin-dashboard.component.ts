import { CommonModule } from '@angular/common';
import { RecentProjectsComponent } from '../recent-projects/recent-projects.component';
import { QuickActionsComponent } from '../quick-actions/quick-actions.component';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { ChartCardComponent } from '../chart-card/chart-card.component';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminSidebarComponent } from "../admin-sidebar/admin-sidebar.component";
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, RecentProjectsComponent, QuickActionsComponent, StatCardComponent, ChartCardComponent, AdminSidebarComponent],
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  
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
  roles: string[] = [];
  isLoggedIn = false;
  isLoginFailed = false;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
  ) { 
    // this.goToChprice-listeckisAdmin();
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  goToCheckisAdmin() {
    if (!this.tokenStorage.getToken() && !this.tokenStorage.getUser() && !this.roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/login']);
    } 
  }
}

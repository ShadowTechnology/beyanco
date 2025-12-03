import { Component, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { HeaderTitleService } from '../../services/header-title-service.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {

  collapsed = false;

  @Output() collapseChanged = new EventEmitter<boolean>();

  constructor(private router: Router, private headerTitleService: HeaderTitleService) { }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    this.collapseChanged.emit(this.collapsed);
  }

  ngOnInit() {
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {
        const currentRoute = event.url;
        // this.changeTitleBasedOnRoute(currentRoute);
      }

    });
  }

  // changeTitleBasedOnRoute(route: string) {
  //   console.log("Current Route:", route);

  //      switch(route) {
  //     case '/dashboard':
  //       this.headerTitleService.setTitle('Dashboard');
  //       break;
  //     case '/projects':
  //       this.headerTitleService.setTitle('Your Design Projects');
  //       break;
  //     case '/newdesign':
  //       this.headerTitleService.setTitle('Create New Design');
  //       break;
  //     case '/analytics':
  //       this.headerTitleService.setTitle('Analytics');
  //       break;
  //     case '/settings':
  //       this.headerTitleService.setTitle('Settings');
  //       break;
  //     default:
  //       this.headerTitleService.setTitle('Dashboard');
  //   }
  // }
}


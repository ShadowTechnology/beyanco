import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-announcements-list',
  imports: [],
  templateUrl: './announcements-list.component.html',
  styleUrl: './announcements-list.component.css'
})
export class AnnouncementsListComponent {
  constructor(private router: Router) { }
  goTo() {
    this.router.navigate(['/announcement-form']);
  }
}

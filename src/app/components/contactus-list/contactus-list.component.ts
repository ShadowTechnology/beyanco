import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-contactus-list',
  imports: [RouterModule],
  templateUrl: './contactus-list.component.html',
  styleUrl: './contactus-list.component.css'
})
export class ContactusListComponent {
  constructor(private router: Router) { }
  goTo() {
    this.router.navigate(['/contactus-form']);
  }
}

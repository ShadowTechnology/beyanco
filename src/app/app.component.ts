import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="showFooter"></app-footer>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      font-family: 'Roboto', sans-serif;
    }

    main {
      min-height: calc(100vh - 70px - 350px);
    }
  `]
})
export class AppComponent {
  title = 'Beyanco AI - Real estate interior visualization tool';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }
  get showFooter(): boolean {
    return !(
      this.router.url.includes('/chat') ||
      this.router.url.includes('/admin-dashboard')
    );
  }
}

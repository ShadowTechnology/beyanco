import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="main-header">
      <div class="container">
        <div class="logo-container">
          <a routerLink="/" class="logo">Beyanco</a>
          <p class="tagline">Real Estate Enhancement Platform</p>
        </div>

        <nav class="main-nav">
          <ul>
            <li><a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
            <li *ngIf="isLoggedIn"><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
            <li *ngIf="isLoggedIn"><a routerLink="/property-upload" routerLinkActive="active">Upload</a></li>
            <li *ngIf="isLoggedIn"><a routerLink="/profile" routerLinkActive="active">Profile</a></li>
            <li *ngIf="!isLoggedIn"><a routerLink="/login" routerLinkActive="active" class="login-btn">Login</a></li>
            <li *ngIf="!isLoggedIn"><a routerLink="/register" routerLinkActive="active" class="register-btn">Register</a></li>
            <li *ngIf="isLoggedIn"><a href="#" (click)="logout($event)" class="logout-btn">Logout</a></li>
          </ul>
        </nav>

        <div class="mobile-menu-toggle" (click)="toggleMenu()">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
      </div>
    </header>
  `,
  styles: `
    .main-header {
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 15px 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-container {
      display: flex;
      flex-direction: column;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2a3990;
      text-decoration: none;
    }

    .tagline {
      font-size: 0.75rem;
      color: #666;
    }

    .main-nav ul {
      display: flex;
      list-style: none;
      gap: 20px;
      margin: 0;
      padding: 0;
    }

    .main-nav a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      padding: 5px 0;
      transition: color 0.3s;
      position: relative;
    }

    .main-nav a:hover {
      color: #2a3990;
    }

    .main-nav a.active {
      color: #2a3990;
    }

    .main-nav a.active::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #2a3990;
    }

    .login-btn, .register-btn, .logout-btn {
      padding: 8px 16px !important;
      border-radius: 5px;
      transition: background-color 0.3s !important;
    }

    .login-btn {
      background-color: transparent;
      border: 1px solid #2a3990;
      color: #2a3990 !important;
    }

    .login-btn:hover {
      background-color: rgba(42, 57, 144, 0.05);
    }

    .register-btn {
      background-color: #eb5757;
      color: white !important;
      border: 1px solid #eb5757;
    }

    .register-btn:hover {
      background-color: #d04848;
      border-color: #d04848;
    }

    .logout-btn {
      background-color: #f0f0f0;
      color: #666 !important;
    }

    .logout-btn:hover {
      background-color: #e0e0e0;
    }

    .mobile-menu-toggle {
      display: none;
      flex-direction: column;
      cursor: pointer;
    }

    .bar {
      width: 25px;
      height: 3px;
      background-color: #2a3990;
      margin: 3px 0;
      border-radius: 3px;
      transition: 0.3s;
    }

    @media (max-width: 768px) {
      .main-nav {
        position: fixed;
        top: 70px;
        left: 0;
        width: 100%;
        background-color: white;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .main-nav.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      .main-nav ul {
        flex-direction: column;
        align-items: center;
      }

      .mobile-menu-toggle {
        display: flex;
      }

      .mobile-menu-toggle.active .bar:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
      }

      .mobile-menu-toggle.active .bar:nth-child(2) {
        opacity: 0;
      }

      .mobile-menu-toggle.active .bar:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
      }
    }
  `
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isMobileMenuActive = false;

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.isLoggedIn = !!this.tokenStorage.getToken();
     this.tokenStorage.isLoggedIn$.subscribe(status => {
    this.isLoggedIn = status;
  });
  }

  logout(event: Event): void {
    event.preventDefault();
    this.tokenStorage.signOut();
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }

  toggleMenu(): void {
    this.isMobileMenuActive = !this.isMobileMenuActive;
    const navElement = document.querySelector('.main-nav');
    const toggleElement = document.querySelector('.mobile-menu-toggle');

    if (navElement && toggleElement) {
      if (this.isMobileMenuActive) {
        navElement.classList.add('active');
        toggleElement.classList.add('active');
      } else {
        navElement.classList.remove('active');
        toggleElement.classList.remove('active');
      }
    }
  }
}

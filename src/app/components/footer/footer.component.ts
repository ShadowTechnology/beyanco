import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="main-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <h2>Beyanco</h2>
            <p>Real Estate Enhancement Platform</p>
          </div>
          <div class="footer-links">
            <div class="link-group">
              <h4>Company</h4>
              <ul>
                <li><a routerLink="/about">About Us</a></li>
                <li><a routerLink="/contact">Contact</a></li>
                <li><a routerLink="/careers">Careers</a></li>
              </ul>
            </div>
            <div class="link-group">
              <h4>Resources</h4>
              <ul>
                <li><a routerLink="/blog">Blog</a></li>
                <li><a routerLink="/docs">Documentation</a></li>
                <li><a routerLink="/api">API</a></li>
              </ul>
            </div>
            <div class="link-group">
              <h4>Legal</h4>
              <ul>
                <li><a routerLink="/terms">Terms of Service</a></li>
                <li><a routerLink="/privacy">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="social-media">
          <a href="#" class="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a href="#" class="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="#" class="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
          </a>
          <a href="#" class="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>
        <div class="copyright">
          &copy; 2025 Beyanco. All rights reserved.
        </div>
      </div>
    </footer>
  `,
  styles: `
    .main-footer {
      background-color: #1e2642;
      color: white;
      padding: 60px 0 30px;
      margin-top: 60px;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      flex-wrap: wrap;
      gap: 30px;
    }

    .footer-logo h2 {
      font-size: 1.8rem;
      margin-bottom: 10px;
      color: white;
    }

    .footer-logo p {
      color: #ccc;
      font-size: 0.9rem;
    }

    .footer-links {
      display: flex;
      gap: 60px;
      flex-wrap: wrap;
    }

    .link-group h4 {
      font-size: 1.2rem;
      margin-bottom: 20px;
      color: #5b9bd5;
    }

    .link-group ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .link-group li {
      margin-bottom: 10px;
    }

    .link-group a {
      color: #ccc;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .link-group a:hover {
      color: white;
    }

    .social-media {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 30px;
    }

    .social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: white;
      transition: background-color 0.3s ease;
    }

    .social-icon:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .copyright {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: #ccc;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
      }

      .footer-links {
        flex-direction: column;
        gap: 30px;
      }
    }
  `
})
export class FooterComponent {
}

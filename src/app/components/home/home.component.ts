import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1>Transform Your Real Estate Photos in Seconds</h1>
            <p class="subtitle">Enhance your property listings with AI-powered editing tools</p>
            <div class="cta-buttons">
              <button class="btn btn-primary" (click)="navigateToRegister()">Get Started</button>
              <button class="btn btn-secondary" (click)="scrollToFeatures()">See Features</button>
            </div>
          </div>
          <div class="hero-image">
            <div class="comparison-wrapper">
              <img src="assets/images/before.jpg" alt="Original Property" class="before-image">
              <div class="after-overlay">
                <img src="assets/images/after.jpg" alt="Enhanced Property" class="after-image">
              </div>
              <div class="slider-line"></div>
              <div class="labels">
                <span class="before-label">Before</span>
                <span class="after-label">After</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="how-it-works" id="features">
        <div class="container">
          <h2 class="section-title">How It Works</h2>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <h3>Upload Your Photo</h3>
              <p>Upload any property photo that needs enhancement</p>
              <div class="step-icon">📁</div>
            </div>

            <div class="step">
              <div class="step-number">2</div>
              <h3>Choose Enhancement</h3>
              <p>Select from various enhancement options like staging, decluttering, or renovation</p>
              <div class="step-icon">🎨</div>
            </div>

            <div class="step">
              <div class="step-number">3</div>
              <h3>Get Results</h3>
              <p>Receive your enhanced property photo in just seconds</p>
              <div class="step-icon">✨</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="container">
          <h2 class="section-title">Transform Any Property</h2>
          <div class="features-grid">
            <div class="feature">
              <div class="feature-icon">🏠</div>
              <h3>Virtual Staging</h3>
              <p>Add furniture and decor to empty rooms to help buyers visualize the space</p>
            </div>

            <div class="feature">
              <div class="feature-icon">🧹</div>
              <h3>Decluttering</h3>
              <p>Remove unwanted items and clutter from property photos</p>
            </div>

            <div class="feature">
              <div class="feature-icon">🔨</div>
              <h3>Renovations</h3>
              <p>Visualize potential improvements like new flooring, paint, or fixtures</p>
            </div>

            <div class="feature">
              <div class="feature-icon">🌳</div>
              <h3>Exterior Enhancement</h3>
              <p>Improve curb appeal with landscaping and exterior renovations</p>
            </div>

            <div class="feature">
              <div class="feature-icon">☀️</div>
              <h3>Sky Replacement</h3>
              <p>Replace gray skies with beautiful blue ones for better impressions</p>
            </div>

            <div class="feature">
              <div class="feature-icon">📱</div>
              <h3>Easy Sharing</h3>
              <p>Easily share enhanced photos with clients or on listings</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section class="pricing" id="pricing">
        <div class="container">
          <h2 class="section-title">Choose Your Plan</h2>
          <div class="pricing-grid">
            <div class="pricing-card basic">
              <div class="card-header">
                <h3>Basic</h3>
                <div class="price">$19.99<span>/month</span></div>
              </div>
              <div class="card-body">
                <ul class="features-list">
                  <li>10 photo enhancements</li>
                  <li>Virtual staging</li>
                  <li>Decluttering</li>
                  <li>Basic renovations</li>
                  <li>Email support</li>
                </ul>
                <button class="btn btn-primary" (click)="navigateToRegister()">Get Started</button>
              </div>
            </div>

            <div class="pricing-card pro">
              <div class="ribbon">Popular</div>
              <div class="card-header">
                <h3>Professional</h3>
                <div class="price">$39.99<span>/month</span></div>
              </div>
              <div class="card-body">
                <ul class="features-list">
                  <li>30 photo enhancements</li>
                  <li>Advanced staging options</li>
                  <li>Complete renovations</li>
                  <li>Exterior enhancements</li>
                  <li>Priority support</li>
                </ul>
                <button class="btn btn-primary" (click)="navigateToRegister()">Get Started</button>
              </div>
            </div>

            <div class="pricing-card enterprise">
              <div class="card-header">
                <h3>Enterprise</h3>
                <div class="price">$89.99<span>/month</span></div>
              </div>
              <div class="card-body">
                <ul class="features-list">
                  <li>Unlimited enhancements</li>
                  <li>All premium features</li>
                  <li>Custom branding</li>
                  <li>API access</li>
                  <li>Dedicated support</li>
                </ul>
                <button class="btn btn-primary" (click)="navigateToRegister()">Get Started</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="cta">
        <div class="container">
          <h2>Ready to Transform Your Property Photos?</h2>
          <p>Sign up now and get 3 free credits to try our service</p>
          <button class="btn btn-primary" (click)="navigateToRegister()">Get Started</button>
        </div>
      </section>
    </div>
  `,
  styles: `
    /* Reset & Base Styles */
    .landing-page {
      font-family: 'Roboto', sans-serif;
      color: #333;
      line-height: 1.6;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .section-title {
      text-align: center;
      font-size: 2.5rem;
      color: #2a3990;
      margin-bottom: 50px;
    }

    .btn {
      display: inline-block;
      padding: 12px 30px;
      border-radius: 5px;
      font-weight: 600;
      font-size: 1rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }

    .btn-primary {
      background-color: #eb5757;
      color: white;
    }

    .btn-primary:hover {
      background-color: #d04848;
    }

    .btn-secondary {
      background-color: transparent;
      border: 2px solid #fff;
      color: white;
    }

    .btn-secondary:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, #2a3990, #1e2642);
      color: white;
      padding: 100px 0;
      position: relative;
      overflow: hidden;
    }

    .hero .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 40px;
    }

    .hero-content {
      flex: 1;
    }

    .hero h1 {
      font-size: 3rem;
      line-height: 1.2;
      margin-bottom: 20px;
      font-weight: 700;
    }

    .subtitle {
      font-size: 1.3rem;
      margin-bottom: 30px;
      opacity: 0.9;
    }

    .cta-buttons {
      display: flex;
      gap: 15px;
    }

    .hero-image {
      flex: 1;
    }

    .comparison-wrapper {
      position: relative;
      width: 100%;
      max-width: 500px;
      height: 350px;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    }

    .before-image, .after-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .after-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      overflow: hidden;
    }

    .slider-line {
      position: absolute;
      top: 0;
      left: 50%;
      width: 2px;
      height: 100%;
      background-color: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
      z-index: 10;
    }

    .labels {
      position: absolute;
      bottom: 15px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 15px;
    }

    .before-label, .after-label {
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 5px 10px;
      border-radius: 3px;
      font-size: 0.9rem;
    }

    /* How It Works Section */
    .how-it-works {
      padding: 100px 0;
      background-color: #f7f7f7;
    }

    .steps {
      display: flex;
      justify-content: space-between;
      gap: 30px;
    }

    .step {
      background-color: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      text-align: center;
      flex: 1;
      transition: transform 0.3s ease;
    }

    .step:hover {
      transform: translateY(-10px);
    }

    .step-number {
      width: 40px;
      height: 40px;
      background-color: #2a3990;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-weight: bold;
    }

    .step h3 {
      margin-bottom: 15px;
      color: #2a3990;
    }

    .step p {
      margin-bottom: 20px;
      color: #666;
    }

    .step-icon {
      font-size: 2.5rem;
      margin-top: 20px;
    }

    /* Features Section */
    .features {
      padding: 100px 0;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
    }

    .feature {
      text-align: center;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      background-color: white;
      transition: transform 0.3s ease;
    }

    .feature:hover {
      transform: translateY(-10px);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 20px;
    }

    .feature h3 {
      color: #2a3990;
      margin-bottom: 15px;
    }

    .feature p {
      color: #666;
    }

    /* Pricing Section */
    .pricing {
      padding: 100px 0;
      background-color: #f7f7f7;
    }

    .pricing-grid {
      display: flex;
      justify-content: center;
      gap: 30px;
    }

    .pricing-card {
      background-color: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      flex: 1;
      max-width: 350px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
    }

    .pricing-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }

    .pricing-card.pro {
      border-top: 5px solid #eb5757;
      transform: scale(1.05);
    }

    .ribbon {
      position: absolute;
      top: 20px;
      right: -30px;
      background-color: #eb5757;
      color: white;
      padding: 5px 30px;
      transform: rotate(45deg);
      font-size: 0.9rem;
      font-weight: 600;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .card-header {
      padding: 30px;
      text-align: center;
      border-bottom: 1px solid #f0f0f0;
    }

    .pricing-card h3 {
      color: #2a3990;
      font-size: 1.5rem;
      margin-bottom: 15px;
    }

    .price {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2a3990;
    }

    .price span {
      font-size: 1rem;
      font-weight: 400;
      color: #666;
    }

    .card-body {
      padding: 30px;
    }

    .features-list {
      list-style-type: none;
      padding: 0;
      margin-bottom: 30px;
    }

    .features-list li {
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
      position: relative;
      padding-left: 25px;
    }

    .features-list li::before {
      content: "✓";
      color: #eb5757;
      position: absolute;
      left: 0;
    }

    /* CTA Section */
    .cta {
      background: linear-gradient(135deg, #2a3990, #1e2642);
      color: white;
      text-align: center;
      padding: 80px 0;
    }

    .cta h2 {
      font-size: 2.5rem;
      margin-bottom: 20px;
    }

    .cta p {
      font-size: 1.2rem;
      margin-bottom: 30px;
      opacity: 0.9;
    }

    /* Responsive Styles */
    @media (max-width: 768px) {
      .hero .container {
        flex-direction: column;
      }

      .hero h1 {
        font-size: 2.5rem;
      }

      .subtitle {
        font-size: 1.1rem;
      }

      .comparison-wrapper {
        height: 250px;
      }

      .steps {
        flex-direction: column;
      }

      .pricing-grid {
        flex-direction: column;
        align-items: center;
      }

      .pricing-card {
        max-width: 100%;
        width: 100%;
      }

      .pricing-card.pro {
        transform: none;
      }
    }
  `
})
export class HomeComponent {
  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {
    // Check if user is already logged in
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/dashboard']);
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  scrollToFeatures(): void {
    const featuresElement = document.getElementById('features');
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

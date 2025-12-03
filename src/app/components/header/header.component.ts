import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isMobileMenuActive = false;
  userCredits: any;
  userId: number = 0;
  isPopupOpen = false;
  count = 1;
  totalPrice = 10;
  selectedCurrency: string = 'INR';

  currencyRates: any = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    AUD: 0.018
  };
  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.tokenStorage.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;

      if (this.isLoggedIn) {
        const user = this.tokenStorage.getUser();
        this.userId = user?.id;
        this.loadCredit(this.userId);
      }
    });
  }

  loadCredit(id: number): void {
    if (id > 0) {
      this.userService.getUserProfile(this.userId).subscribe({
        next: (user) => {
          this.userCredits = user.creditsRemaining;

          // ✅ Update local storage instantly
          this.tokenStorage.updateUserCredits(user.creditsRemaining);
        },
        error: (err) => console.error('Error loading user credits:', err)
      });
    }
  }
  onCurrencyChange() {
    this.updatePrice();
  }
  logout(event: Event): void {
    event.preventDefault();
    this.tokenStorage.signOut();
    this.router.navigate(['/login']).then(() => {
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
  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    const target = event.target.closest('.filter-card, .credit-badge');
    if (!target) this.isPopupOpen = false;
  }

  togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
  }
  updatePrice() {
    this.totalPrice = this.count * 10;
  }
  updateSlider(event: any) {
    const slider = event.target;
    const percent = (this.count / slider.max) * 100;
    slider.style.setProperty("--percent", percent + "%");
  }

}

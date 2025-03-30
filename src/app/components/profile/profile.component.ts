import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <h2 class="profile-header">My Profile</h2>

        <div class="profile-avatar">
          <div class="avatar-circle">
            {{ getInitials() }}
          </div>
        </div>

        <div class="profile-details">
          <div class="detail-item">
            <span class="label">Username:</span>
            <span class="value">{{ currentUser.username }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Email:</span>
            <span class="value">{{ currentUser.email }}</span>
          </div>

          <div class="detail-item" *ngIf="currentUser.firstName">
            <span class="label">First Name:</span>
            <span class="value">{{ currentUser.firstName }}</span>
          </div>

          <div class="detail-item" *ngIf="currentUser.lastName">
            <span class="label">Last Name:</span>
            <span class="value">{{ currentUser.lastName }}</span>
          </div>

          <div class="detail-item" *ngIf="currentUser.companyName">
            <span class="label">Company:</span>
            <span class="value">{{ currentUser.companyName }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Subscription:</span>
            <span class="value subscription-value">
              {{ formatSubscriptionType(currentUser.subscriptionType) }}
              <span class="subscription-status" [ngClass]="getStatusClass(currentUser.subscriptionStatus)">
                {{ formatSubscriptionStatus(currentUser.subscriptionStatus) }}
              </span>
            </span>
          </div>

          <div class="detail-item">
            <span class="label">Credits Remaining:</span>
            <span class="value credits-value">{{ currentUser.creditsRemaining || 0 }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Roles:</span>
            <span class="value">
              <span class="role" *ngFor="let role of currentUser.roles">
                {{ formatRole(role) }}
              </span>
            </span>
          </div>
        </div>

        <div class="profile-actions">
          <button class="btn btn-upgrade">Upgrade Subscription</button>
          <button class="btn btn-secondary">Edit Profile</button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .profile-container {
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }

    .profile-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      padding: 30px;
      width: 100%;
      max-width: 600px;
    }

    .profile-header {
      color: #2a3990;
      text-align: center;
      margin-bottom: 30px;
    }

    .profile-avatar {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }

    .avatar-circle {
      width: 100px;
      height: 100px;
      background-color: #2a3990;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2.5rem;
      font-weight: 600;
    }

    .profile-details {
      margin-bottom: 30px;
    }

    .detail-item {
      display: flex;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #f0f0f0;
    }

    .detail-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .label {
      font-weight: 600;
      color: #2a3990;
      width: 150px;
    }

    .value {
      color: #333;
      flex: 1;
    }

    .subscription-value {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .subscription-status {
      font-size: 0.8rem;
      padding: 3px 8px;
      border-radius: 3px;
    }

    .status-active {
      background-color: #d4edda;
      color: #155724;
    }

    .status-expired {
      background-color: #f8d7da;
      color: #721c24;
    }

    .status-trial {
      background-color: #fff3cd;
      color: #856404;
    }

    .credits-value {
      font-weight: 600;
      color: #2a3990;
    }

    .role {
      display: inline-block;
      background-color: #f0f0f0;
      color: #666;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 0.8rem;
      margin-right: 5px;
      margin-bottom: 5px;
    }

    .profile-actions {
      display: flex;
      gap: 15px;
    }

    .btn {
      padding: 12px 20px;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      cursor: pointer;
      flex: 1;
      transition: background-color 0.3s;
    }

    .btn-upgrade {
      background-color: #eb5757;
      color: white;
    }

    .btn-upgrade:hover {
      background-color: #d04848;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
    }

    @media (max-width: 768px) {
      .detail-item {
        flex-direction: column;
      }

      .label {
        margin-bottom: 5px;
        width: auto;
      }

      .profile-actions {
        flex-direction: column;
      }
    }
  `
})
export class ProfileComponent implements OnInit {
  currentUser: any = {};

  constructor(private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser();
  }

  getInitials(): string {
    if (this.currentUser.firstName && this.currentUser.lastName) {
      return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`;
    } else if (this.currentUser.firstName) {
      return this.currentUser.firstName.charAt(0);
    } else if (this.currentUser.username) {
      return this.currentUser.username.charAt(0).toUpperCase();
    }
    return 'U';
  }

  formatSubscriptionType(type: string | undefined): string {
    if (!type) return 'Free';

    const types: { [key: string]: string } = {
      'free': 'Free',
      'basic': 'Basic',
      'premium': 'Premium',
      'enterprise': 'Enterprise'
    };

    return types[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }

  formatSubscriptionStatus(status: string | undefined): string {
    if (!status) return '';

    const statuses: { [key: string]: string } = {
      'active': 'Active',
      'expired': 'Expired',
      'trial': 'Trial'
    };

    return statuses[status] || status.charAt(0).toUpperCase() + status.slice(1);
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return '';

    const classes: { [key: string]: string } = {
      'active': 'status-active',
      'expired': 'status-expired',
      'trial': 'status-trial'
    };

    return classes[status] || '';
  }

  formatRole(role: string): string {
    return role.replace('ROLE_', '').charAt(0) + role.replace('ROLE_', '').slice(1).toLowerCase();
  }
}

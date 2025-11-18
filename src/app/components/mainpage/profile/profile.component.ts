import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TokenStorageService } from '../../../services/token-storage.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  currentUser: any = {};
  isLoading = true;
  isEditing = false;
  userRoles = '';
  form: any = {
    name: '',
    email: '',
    phone: '',
    company: ''
  };
  recentActivity: any[] = [];

  constructor(
    private tokenService: TokenStorageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    const user = this.tokenService.getUser();
    
    if (user && user.id) {
      this.userService.getUserProfile(user.id).subscribe(
        (data: User) => {
          this.currentUser = data;
          this.form.name = data.username || '';
          this.form.email = data.email;
          this.form.phone = data.mobile || '';
          this.form.company = data.company || '';
          
          // Format roles for display
          this.userRoles = data.roles 
            ? data.roles.map((role: any) => role.name.replace('ROLE_', '')).join(', ') 
            : 'User';
          
          this.loadRecentActivity();
          this.isLoading = false;
        },
        (error: any) => {
          console.error('Error loading user profile:', error);
          this.isLoading = false;
        }
      );
    } else {
      this.isLoading = false;
    }
  }

  loadRecentActivity(): void {
    // In a real app, this would be fetched from the backend
    // This is a mock implementation
    this.recentActivity = [
      {
        type: 'upload',
        description: 'Uploaded a new property image',
        date: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        type: 'edit',
        description: 'Updated profile information',
        date: new Date(Date.now() - 259200000) // 3 days ago
      },
      {
        type: 'login',
        description: 'Logged in from a new device',
        date: new Date(Date.now() - 604800000) // 7 days ago
      }
    ];
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset form
      this.form.name = this.currentUser.name || '';
      this.form.email = this.currentUser.email;
      this.form.phone = this.currentUser.phone || '';
      this.form.company = this.currentUser.company || '';
    }
  }

  updateProfile(): void {
    const updatedUser = {
      ...this.currentUser,
      name: this.form.name,
      email: this.form.email,
      phone: this.form.phone,
      company: this.form.company
    };

    this.userService.updateUserProfile(updatedUser).subscribe(
      (response: any) => {
        this.currentUser = response;
        this.isEditing = false;
        
        // Add activity
        this.recentActivity.unshift({
          type: 'edit',
          description: 'Updated profile information',
          date: new Date()
        });
      },
      (error: any) => {
        console.error('Error updating profile:', error);
      }
    );
  }

  getSubscriptionPlan(): string {
    // Mock implementation - this would come from the user object in a real app
    if (this.currentUser.subscriptionPlan) {
      return this.currentUser.subscriptionPlan;
    }
    
    if (this.currentUser.creditsRemaining && this.currentUser.creditsRemaining > 50) {
      return 'Premium Plan';
    } else if (this.currentUser.creditsRemaining && this.currentUser.creditsRemaining > 20) {
      return 'Standard Plan';
    } else {
      return 'Basic Plan';
    }
  }

  getNextBillingDate(): string {
    // Mock implementation - this would come from the user object in a real app
    if (this.currentUser.nextBillingDate) {
      return new Date(this.currentUser.nextBillingDate).toLocaleDateString();
    }
    return new Date(Date.now() + 2592000000).toLocaleDateString(); // 30 days from now
  }

  getActivityIcon(type: string): string {
    switch(type) {
      case 'upload': return 'fa-upload';
      case 'edit': return 'fa-edit';
      case 'login': return 'fa-sign-in-alt';
      case 'delete': return 'fa-trash';
      default: return 'fa-circle';
    }
  }
}
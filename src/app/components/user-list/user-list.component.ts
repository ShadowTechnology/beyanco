import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollingModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
}
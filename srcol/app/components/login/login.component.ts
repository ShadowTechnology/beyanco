import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Sign In</h2>
        <form
          *ngIf="!isLoggedIn"
          name="form"
          (ngSubmit)="f.form.valid && onSubmit()"
          #f="ngForm"
          novalidate
        >
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              class="form-control"
              name="username"
              [(ngModel)]="form.username"
              required
              #username="ngModel"
              [ngClass]="{ 'is-invalid': f.submitted && username.errors }"
            />
            <div *ngIf="username.errors && f.submitted" class="invalid-feedback">
              Username is required!
            </div>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              class="form-control"
              name="password"
              [(ngModel)]="form.password"
              required
              minlength="6"
              #password="ngModel"
              [ngClass]="{ 'is-invalid': f.submitted && password.errors }"
            />
            <div *ngIf="password.errors && f.submitted" class="invalid-feedback">
              <div *ngIf="password.errors['required']">Password is required</div>
              <div *ngIf="password.errors['minlength']">
                Password must be at least 6 characters
              </div>
            </div>
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block">
              Login
            </button>
          </div>
          <div class="form-group">
            <div
              class="alert alert-danger"
              role="alert"
              *ngIf="f.submitted && isLoginFailed"
            >
              Login failed: {{ errorMessage }}
            </div>
          </div>
        </form>

        <div class="alert alert-success" *ngIf="isLoggedIn">
          Logged in as {{ roles }}.
        </div>

        <div class="register-link">
          Don't have an account? <a routerLink="/register">Register now</a>
        </div>
      </div>
    </div>
  `,
  styles: `
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      padding: 30px;
      width: 100%;
      max-width: 400px;
    }

    .login-card h2 {
      color: #2a3990;
      text-align: center;
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 1rem;
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 5px;
    }

    .btn {
      display: block;
      width: 100%;
      padding: 12px;
      background-color: #eb5757;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn:hover {
      background-color: #d04848;
    }

    .alert {
      padding: 10px 15px;
      border-radius: 5px;
      margin-top: 15px;
    }

    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .register-link {
      text-align: center;
      margin-top: 20px;
      font-size: 0.9rem;
    }

    .register-link a {
      color: #2a3990;
      text-decoration: none;
      font-weight: 600;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.redirectAfterLogin();
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.redirectAfterLogin();
      },
      error: err => {
        this.errorMessage = err.error.message || 'Login failed';
        this.isLoginFailed = true;
      }
    });
  }

  redirectAfterLogin(): void {
    this.router.navigate(['/dashboard']);
  }
}

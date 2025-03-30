import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>Sign Up</h2>
        <form
          *ngIf="!isSuccessful"
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
              minlength="3"
              maxlength="20"
              #username="ngModel"
              [ngClass]="{ 'is-invalid': f.submitted && username.errors }"
            />
            <div class="invalid-feedback" *ngIf="username.errors && f.submitted">
              <div *ngIf="username.errors['required']">Username is required</div>
              <div *ngIf="username.errors['minlength']">
                Username must be at least 3 characters
              </div>
              <div *ngIf="username.errors['maxlength']">
                Username must be at most 20 characters
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              class="form-control"
              name="email"
              [(ngModel)]="form.email"
              required
              email
              #email="ngModel"
              [ngClass]="{ 'is-invalid': f.submitted && email.errors }"
            />
            <div class="invalid-feedback" *ngIf="email.errors && f.submitted">
              <div *ngIf="email.errors['required']">Email is required</div>
              <div *ngIf="email.errors['email']">
                Email must be a valid email address
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              type="text"
              class="form-control"
              name="firstName"
              [(ngModel)]="form.firstName"
              #firstName="ngModel"
            />
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              type="text"
              class="form-control"
              name="lastName"
              [(ngModel)]="form.lastName"
              #lastName="ngModel"
            />
          </div>

          <div class="form-group">
            <label for="companyName">Company Name (Optional)</label>
            <input
              type="text"
              class="form-control"
              name="companyName"
              [(ngModel)]="form.companyName"
              #companyName="ngModel"
            />
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
            <div class="invalid-feedback" *ngIf="password.errors && f.submitted">
              <div *ngIf="password.errors['required']">Password is required</div>
              <div *ngIf="password.errors['minlength']">
                Password must be at least 6 characters
              </div>
            </div>
          </div>

          <div class="form-group">
            <button class="btn btn-primary btn-block">Sign Up</button>
          </div>

          <div class="alert alert-warning" *ngIf="f.submitted && isSignUpFailed">
            Signup failed!<br />{{ errorMessage }}
          </div>
        </form>

        <div class="alert alert-success" *ngIf="isSuccessful">
          Your registration is successful! <a routerLink="/login">Sign in now</a>
        </div>

        <div class="login-link" *ngIf="!isSuccessful">
          Already have an account? <a routerLink="/login">Sign in</a>
        </div>
      </div>
    </div>
  `,
  styles: `
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }

    .register-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      padding: 30px;
      width: 100%;
      max-width: 500px;
    }

    .register-card h2 {
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

    .alert-warning {
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }

    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .login-link {
      text-align: center;
      margin-top: 20px;
      font-size: 0.9rem;
    }

    .login-link a {
      color: #2a3990;
      text-decoration: none;
      font-weight: 600;
    }

    .login-link a:hover {
      text-decoration: underline;
    }
  `
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null,
    firstName: null,
    lastName: null,
    companyName: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { username, email, password, firstName, lastName, companyName } = this.form;

    this.authService.register(username, email, password, firstName, lastName, companyName).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        setTimeout(() => this.router.navigate(['login']), 3000);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}

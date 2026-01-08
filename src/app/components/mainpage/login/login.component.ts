import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';


declare var google: any;
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit  {
  @ViewChild('googleBtn', { static: false }) googleBtn!: ElementRef;
  form: any = { username: null, password: null };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.redirectAfterLogin();
    }
  }
  
  triggerGoogleLogin(): void {
    const btn = this.googleBtn.nativeElement.querySelector('div[role="button"]');
    btn?.click();
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

  // ngAfterViewInit() {
  //   google.accounts.id.initialize({
  //     client_id: environment.googleClientId,
  //     callback: (response: any) => this.sendIdTokenToBackend(response.credential)
  //   });

  //   google.accounts.id.renderButton(
  //     this.googleBtn.nativeElement,
  //     { theme: "filled_blue", size: "large" }
  //   );
  // }
  ngAfterViewInit(): void {
    if (!this.googleBtn) {
      console.error('Google button not found');
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) =>
        this.sendIdTokenToBackend(response.credential)
    });

    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      {
        theme: 'outline',
        size: 'large'
      }
    );
  }

  sendIdTokenToBackend(idToken: string) {
    this.authService.googleLogin(idToken).subscribe({
      next: (data) => {
        console.log("Backend Login Success", data);

        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data.user);   // MUST run before other components read it
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.redirectAfterLogin();
      },
      error: (err) => {
        console.error("Backend Login Error", err);
      }
    });
  }

  redirectAfterLogin(): void {
    if (this.roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/chat']);
    }
  }

}

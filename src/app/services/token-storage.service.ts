import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem(TOKEN_KEY));
  isLoggedIn$ = this.loggedIn.asObservable();
  private creditsSubject = new BehaviorSubject<number>(0);
  credits$ = this.creditsSubject.asObservable();


  constructor() { }

  signOut(): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    this.loggedIn.next(false);
  }

  public saveToken(token: string): void {
    window.localStorage.setItem(TOKEN_KEY, token);
    this.loggedIn.next(true);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    if (user == null) {     // only block null, not objects
      console.error("❌ Tried to save null user!");
      return;
    }

    console.log("Saving user to localStorage:", user);

    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.loggedIn.next(true);
  }



  updateUserCredits(newCredits: any): void {
    const user = this.getUser();
    if (user) {
      user.creditsRemaining = newCredits;
      localStorage.setItem('auth-user', JSON.stringify(user));

      // ✅ Update Observable so ALL components get new value
      this.creditsSubject.next(newCredits);
    }
  }

  public getUser(): any {
    const user = localStorage.getItem(USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch (e) {
      console.error("⚠ Failed to parse user JSON:", user);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }


}

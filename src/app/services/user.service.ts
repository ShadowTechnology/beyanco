import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../environments/environment';

const API_URL = `${environment.backendUrl}/api/users/`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenStorage.getToken();
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Get user profile
  getUserProfile(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Update user profile
  updateUserProfile(user: User): Observable<User> {
    return this.http.put<User>(`${API_URL}${user.id}`, user, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Credits history
  getCreditsHistory(userId: number): Observable<any> {
    return this.http.get(`${API_URL}${userId}/credits/history`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ User activity
  getUserActivity(userId: number): Observable<any> {
    return this.http.get(`${API_URL}${userId}/activity`, {
      headers: this.getAuthHeaders()
    });
  }
}

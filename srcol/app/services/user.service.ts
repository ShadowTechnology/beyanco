import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

const API_URL = 'http://localhost:8080/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUserProfile(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}users/${id}`, httpOptions);
  }

  updateUserProfile(user: User): Observable<User> {
    return this.http.put<User>(`${API_URL}users/${user.id}`, user, httpOptions);
  }

  getCreditsHistory(userId: number): Observable<any> {
    return this.http.get(`${API_URL}users/${userId}/credits/history`, httpOptions);
  }

  getUserActivity(userId: number): Observable<any> {
    return this.http.get(`${API_URL}users/${userId}/activity`, httpOptions);
  }
}
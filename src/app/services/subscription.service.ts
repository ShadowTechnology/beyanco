import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import { Observable } from 'rxjs';
import { Subscription } from '../models/subscription.model';

const API_URL = `${environment.backendUrl}/api/subscriptions`;

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {}

  private getAuthHeaders() {
    const token = this.tokenStorage.getToken();
    return { headers: { Authorization: 'Bearer ' + token } };
  }

  // optional: return active subscriptions for current user
  getMySubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${API_URL}/me`, this.getAuthHeaders());
  }
}

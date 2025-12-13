import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import { Observable } from 'rxjs';

const API_URL = `${environment.backendUrl}/api/payment/`;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {}

  private getAuthHeaders() {
    const token = this.tokenStorage.getToken();
    return { headers: { Authorization: 'Bearer ' + token } };
  }

  createOrder(data: any): Observable<any> {
    return this.http.post(`${API_URL}create-order`, data, this.getAuthHeaders());
  }

  verifyPayment(data: any): Observable<any> {
    return this.http.post(`${API_URL}verify`, data, this.getAuthHeaders());
  }
}

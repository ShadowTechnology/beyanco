import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../environments/environment';

console.log(environment.backendUrl);

const API_URL = `${environment.backendUrl}/api/payment/`;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenStorage.getToken();
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  }

  // -----------------------------
  // 1️⃣ CREATE RAZORPAY ORDER
  // -----------------------------
  createOrder(data: any): Observable<any> {
    return this.http.post(`${API_URL}create-order`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // -----------------------------
  // 2️⃣ VERIFY PAYMENT SIGNATURE
  // -----------------------------
  verifyPayment(data: any): Observable<any> {
    return this.http.post(`${API_URL}verify`, data, {
      headers: this.getAuthHeaders()
    });
  }
}

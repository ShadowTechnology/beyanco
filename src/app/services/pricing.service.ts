import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../environments/environment';

const API_URL = `${environment.backendUrl}/api/plans`;

@Injectable({
  providedIn: 'root'
})
export class PricingService {

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) { }

  private getAuthHeaders() {
    const token = this.tokenStorage.getToken();
    return { headers: { Authorization: 'Bearer ' + token } };
  }

  // 🚀 Load all plans
  // getPlans(): Observable<any> {
  //   return this.http.get(`${API_URL}/getPlans`, this.getAuthHeaders());
  // }
  getPlans() {
    return this.http.get<any[]>(`${API_URL}/getPlans`);
  }


  // 🚀 Create new plan — THE MISSING METHOD
  createPlan(plan: any): Observable<any> {
    return this.http.post(`${API_URL}/createPlan`, plan, this.getAuthHeaders());
  }

  // (Optional) Get plan by ID
  getPlan(id: number): Observable<any> {
    return this.http.get(`${API_URL}/getPlanById/${id}`, this.getAuthHeaders());
  }

  // (Optional) Update plan
  updatePlan(id: number, plan: any): Observable<any> {
    return this.http.put(`${API_URL}/updatePlan/${id}`, plan, this.getAuthHeaders());
  }

  // (Optional) Delete plan
  deletePlan(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/deletePlan/${id}`, this.getAuthHeaders());
  }
}

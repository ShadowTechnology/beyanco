import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private baseUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  getHealthCheck(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/health-check`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../models/property.model';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../environments/environment';

console.log(environment.backendUrl);


const API_URL = `${environment.backendUrl}/api/properties/`;

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  constructor(private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenStorage.getToken();
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  }
  getUserProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(API_URL, {
      headers: this.getAuthHeaders()
    });
  }

  getTestApi() {
    return this.http.get(`${API_URL}test`, { responseType: 'text' });
  }

  getAllProperty(): Observable<Property> {
    return this.http.get<Property>(`${API_URL}all`, {
      headers: this.getAuthHeaders()
    });
  }

  getProperty(id: number): Observable<Property> {
    return this.http.get<Property>(`${API_URL}${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  uploadProperty(formData: FormData): Observable<Property> {
    return this.http.post<Property>(`${API_URL}upload`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  enhanceProperty(id: number): Observable<Property> {
    return this.http.post<Property>(`${API_URL}${id}/enhance`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${API_URL}${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getChatProperty(id: number): Observable<Property> {
    return this.http.get<Property>(`${API_URL}byChat/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // uploadPropertyAsync(formData: FormData): Observable<any> {
  //   return this.http.post(`${API_URL}upload`, formData, {
  //     headers: this.getAuthHeaders()
  //   });
  // }

  uploadPropertyAsync(formData: FormData): Observable<any> {
    return this.http.post(`${API_URL}asyncupload`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  getUploadStatus(jobId: string): Observable<any> {
    return this.http.get(`${API_URL}upload/status/${jobId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getDownloadFile(key: string): Observable<Blob> {
    return this.http.get(
      `${API_URL}download-image?key=${encodeURIComponent(key)}`,
      {
        headers: this.getAuthHeaders(),
        responseType: 'blob'
      }
    );
  }


}

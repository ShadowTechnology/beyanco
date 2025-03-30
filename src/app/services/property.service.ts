import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../models/property.model';

const API_URL = 'http://localhost:8080/api/properties/';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  constructor(private http: HttpClient) { }

  getUserProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(API_URL);
  }

  getProperty(id: number): Observable<Property> {
    return this.http.get<Property>(`${API_URL}${id}`);
  }

  uploadProperty(formData: FormData): Observable<Property> {
    return this.http.post<Property>(`${API_URL}upload`, formData);
  }

  enhanceProperty(id: number): Observable<Property> {
    return this.http.post<Property>(`${API_URL}${id}/enhance`, {});
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${API_URL}${id}`);
  }
}

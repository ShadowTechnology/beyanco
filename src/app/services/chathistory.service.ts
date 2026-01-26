import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatHistory } from '../models/chathistory.model';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../environments/environment';

const API_URL = `${environment.backendUrl}/api/chats/`;

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenStorage.getToken();
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  }

  // ✅ Get all user chats
  getUserChats(): Observable<ChatHistory[]> {
    return this.http.get<ChatHistory[]>(`${API_URL}getUserChats`, {
      headers: this.getAuthHeaders()
    });
  }

  getChatById(chatId: number): Observable<ChatHistory> {
    return this.http.get<ChatHistory>(`${API_URL}${chatId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Create a new chat
  createChat(chat: ChatHistory): Observable<ChatHistory> {
    return this.http.post<ChatHistory>(`${API_URL}createChat`, chat, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Update a chat
  updateChat(id: number, chat: ChatHistory): Observable<ChatHistory> {
    return this.http.put<ChatHistory>(`${API_URL}updateChat/${id}`, chat, {
      headers: this.getAuthHeaders()
    });
  }

  updateChatTitle(id: number, title: string): Observable<any> {
    return this.http.put(
      `${API_URL}updateChat/${id}`,
      { title },
      { headers: this.getAuthHeaders() }
    );
  }

  // ✅ Delete chat
  deleteChat(id: number): Observable<any> {
    return this.http.delete(`${API_URL}deleteChat/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
  // ✅ Rename chat (only title)
  renameChat(id: number, title: string): Observable<any> {
    return this.http.put(
      `${API_URL}updateChat/${id}`,
      { title },
      { headers: this.getAuthHeaders() }
    );
  }

}

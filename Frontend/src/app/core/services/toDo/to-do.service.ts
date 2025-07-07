import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToDoService {
  private apiUrl = 'http://localhost:3000/todos'; // Backend-URL anpassen

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl, { withCredentials: true });
  }

  addTodo(text: string): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, { text }, { withCredentials: true });
  }

  toggleDone(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/toggle`, {}, { withCredentials: true });
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
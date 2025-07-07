// src/app/core/services/toDo/to-do.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  private readonly baseUrl = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl, { withCredentials: true });
  }

  addTodo(text: string): Observable<Todo> {
    return this.http.post<Todo>(
      this.baseUrl,
      { text },
      { withCredentials: true }
    );
  }

  toggleDone(id: number): Observable<Todo> {
    return this.http.patch<Todo>(
      `${this.baseUrl}/${id}/toggle`,
      {},
      { withCredentials: true }
    );
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }
}

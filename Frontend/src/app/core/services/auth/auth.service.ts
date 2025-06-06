// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface Credentials { username: string; password: string; }
interface RegisterData { username: string; email: string; password: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiBase = environment.apiUrl + '/auth';
  private token$ = new BehaviorSubject<string | null>(null);
  public isLoggedIn$: Observable<boolean> = this.token$.pipe(
    map(t => !!t)  //true wenn Token vorhanden
  );

  constructor(private http: HttpClient) {
    //token bei start aus localstorage laden
    const saved = localStorage.getItem(environment.auth.tokenStorageKey);
    this.token$.next(saved);
  }

  //token abfragen
  getToken(): string | null {
    return this.token$.value;
  }

  //login sendet credentials speichert token
  login(data: Credentials): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${this.apiBase}/login`,
      data
    ).pipe(
      map(res => {
        localStorage.setItem(environment.auth.tokenStorageKey, res.token);
        this.token$.next(res.token);
        return res;
      })
    );
  }

  //regestrierung rückgabe der id
  register(data: RegisterData): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(
      `${this.apiBase}/register`,
      data
    );
  }

  //logout token entfernne
  logout(): void {
    localStorage.removeItem(environment.auth.tokenStorageKey);  
    this.token$.next(null);
  }
}

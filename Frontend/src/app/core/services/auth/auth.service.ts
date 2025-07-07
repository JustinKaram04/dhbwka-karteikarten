import { Injectable } from '@angular/core'; // injectable damit angular das ding ins service-regal packt
import { HttpClient } from '@angular/common/http'; // http-client zum api anfunken
import { BehaviorSubject, map, Observable } from 'rxjs'; // rxjs kram für observable streams
import { environment } from '../../../../environments/environment'; // env settings (url, keys)

interface Credentials { username: string; password: string; } // schnittstelle für login
interface RegisterData { username: string; email: string; password: string; } // schnittstelle fürs registrieren

@Injectable({ providedIn: 'root' }) // service an root hängen damit er überall verfügbar is
export class AuthService {
  private apiBase = environment.apiUrl + '/auth'; // basis-url für auth-endpoints
  private token$ = new BehaviorSubject<string | null>(null); // hält aktuelles token oder null
  public isLoggedIn$: Observable<boolean> = this.token$.pipe(
    map(t => !!t)  //mappt token -> boolean, true wenn token nicht null/leer
  );

  constructor(private http: HttpClient) {
    //beim start gucken, ob schon token im localstorage liegt
    const saved = localStorage.getItem(environment.auth.tokenStorageKey);
    this.token$.next(saved); // initial in den behavior-subject pushen
  }

  // token abrufen sonst null
  getToken(): string | null {
    return this.token$.value;
  }

  // login: credentials an backend schicken und token speichern
  login(data: Credentials): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${this.apiBase}/login`,
      data
    ).pipe(
      map(res => {
        // wenn login erfolgreich dann token ins localstorage und in den stream
        localStorage.setItem(environment.auth.tokenStorageKey, res.token);
        this.token$.next(res.token);
        return res; //weiterreichen des responses
      })
    );
  }

  // registrieren: sendet user-daten, bekommt user-id zurück
  register(data: RegisterData): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(
      `${this.apiBase}/register`,
      data
    );
  }

  // logout: token löschen und loggedIn status auf false setzen
  logout(): void {
    localStorage.removeItem(environment.auth.tokenStorageKey);  
    this.token$.next(null); // stream auf null pushen -> isLoggedIn$ wird false
  }
}

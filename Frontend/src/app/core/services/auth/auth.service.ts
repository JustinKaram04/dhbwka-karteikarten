import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  private masterUsername: string = "a";
  private masterPassword: string = "1";



  login(username: string, password: string): boolean {
    if (username === this.masterUsername && password === this.masterPassword) {
      this.loggedIn = true;
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedIn = false;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}

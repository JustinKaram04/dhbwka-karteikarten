import { Injectable } from '@angular/core';
import { IUserData } from '../../models/iuserdata';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private loggedUser: IUserData | undefined;

  
  MasterUser: IUserData = {
    id: "1",
    username:"a",
    password: "1",
    email: "",
  }
  DevUser: IUserData = {
    id: "2",
    username:"Developer",
    password: "12345678",
    email: "",
  }

  private users: IUserData[] = [
    this.MasterUser,
    this.DevUser,
    {id: "222", username: "b", password: "2", email: ""},
  ]

  testUsernameAvailable(username: string): boolean {
    return !this.users.some(user => user.username === username);
  }

  register(userData: IUserData): void {
    this.users.push(userData);
  }

  login(username: string, password: string): boolean {
    if (this.users.some(user => user.username === username && user.password === password)) {
      this.loggedIn = true;
      this.loggedUser = this.users.find(user => user.username === username);
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedIn = false;
    this.loggedUser = undefined;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private masterUsername: string = "Developer";
  private masterPassword: string = "12345678";
  public loginFailed: boolean = false;

  inputUsername: string = "";
  inputPassword: string = "";

  constructor(private router: Router) {}


  public inputCheck(inputUsername: string, inputPassword: string) {
    if (this.masterUsername === inputUsername && this.masterPassword === inputPassword) {
      console.log('Login erfolgreich');
      this.loginFailed = false;
      this.router.navigate(['/mainpage']);
    } else {
      console.log('Login fehlgeschlagen');
      this.loginFailed = true;
    }
  }
}

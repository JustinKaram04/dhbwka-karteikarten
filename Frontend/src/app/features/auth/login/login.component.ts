import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  inputUsername: string = "";
  inputPassword: string = "";
  loginFailed: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  public inputCheck(inputUsername: string, inputPassword: string) {
    if (this.authService.login(inputUsername, inputPassword)) {
      console.log('Login erfolgreich');
      this.loginFailed = false;
      this.router.navigate(['']);
    } else {
      console.log('Login fehlgeschlagen');
      this.loginFailed = true;
    }
  }
}

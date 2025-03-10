import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  inputUsername: string = "";
  inputPassword: string = "";
  loginFailed: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  navigateToSignup() {
    this.router.navigate(['signup']);
  }


  public inputCheck(inputUsername: string, inputPassword: string) {
    if (this.authService.login(inputUsername, inputPassword)) {
      console.log('Login erfolgreich');
      this.loginFailed = false;
      this.router.navigate(['']);
    } else {
      console.log('Login fehlgeschlagen');
      this.loginFailed = true;
      setTimeout(() => {
        this.loginFailed = false;
      }, 4000);
    }
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // hier die beiden Felder, die im Template gebunden werden:
  inputUsername = '';
  inputPassword = '';
  loginFailed = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  // Methode, die beim ngSubmit aufgerufen wird
  inputCheck(): void {
    this.auth.login({ username: this.inputUsername, password: this.inputPassword })
      .subscribe({
        next: () => {
          this.loginFailed = false;
          this.router.navigate(['/']);
        },
        error: () => {
          this.loginFailed = true;
          setTimeout(() => (this.loginFailed = false), 4000);
        }
      });
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}

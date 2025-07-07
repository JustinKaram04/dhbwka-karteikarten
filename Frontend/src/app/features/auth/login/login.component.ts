import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // forms-modul für ngModel & ngSubmit
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service'; // unser auth-service
import { HeaderComponent } from '../../../shared/components/header/header.component'; // header-komponente

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  inputUsername = '';// hier speicher ich den eingabewert für username
  inputPassword = '';// hier speicher ich das passwort
  loginFailed = false;// flag ob login fehlgeschlagen is

  constructor(
    private auth: AuthService, // auth-service reinziehen per DI
    private router: Router// router zum navigieren
  ) {}

  // wird aufgerufen, wenn das login-form abgeschickt wird
  inputCheck(): void {
    this.auth.login({ username: this.inputUsername, password: this.inputPassword })
      .subscribe({
        next: () => {
          this.loginFailed = false;// fehler zurücksetzen
          this.router.navigate(['/']);// nach erfolgreichem login zur startseite
        },
        error: () => {
          this.loginFailed = true;// show fehlermeldung
          setTimeout(() => (this.loginFailed = false), 4000); // nach 4s wieder ausblenden
        }
      });
  }

  // navigiert zur signup-seite, wenn user noch keinen account hat
  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}

import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [HeaderComponent, FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registrationForm: FormGroup = new FormGroup({});
  id: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  registrationFailed: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private service: AuthService) {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]] // Passwort muss mindestens 8 Zeichen lang sein
    });
  }

  registerUser() {
    if (this.service.testUsernameAvailable(this.username) && this.registrationForm.valid) {
      this.id = Date.now.toString();
      this.service.register({
        id: this.id,
        username: this.username,
        email: this.email,
        password: this.password
      });
      console.log('Benutzer registriert:', {
        username: this.username,
        email: this.email,
        password: this.password,
      });
      this.router.navigate(['/login']); // Nach erfolgreicher Registrierung zur Login-Seite navigieren
    } else {
      this.registrationFailed = true; // Falls Eingaben fehlen, Fehler anzeigen
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']); // Zur Login-Seite navigieren
  }
}

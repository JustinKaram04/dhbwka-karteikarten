import { Component }       from '@angular/core';
import { Router }          from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // form-builder für reactive forms
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule }    from '@angular/common';
import { AuthService }     from '../../../core/services/auth/auth.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm: FormGroup;// reactive form objekt
  registrationFailed = false;// flag, ob registrierung schiefgegangen ist

  constructor(
    private router: Router,// router reinziehen über DI
    private fb: FormBuilder,// form builder reinziehen
    private auth: AuthService// auth-service zum ansprechen der api
  ) {
    // form initial aufbauen mit validation rules
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // username braucht min 3 chars
      email:    ['', [Validators.required, Validators.email]],// email muss valid sein
      password: ['', [Validators.required, Validators.minLength(8)]] // pw braucht min 8 chars
    });
  }

  // methode wird beim klick auf registrieren-button ausgeführt
  registerUser(): void {
    // wenn form invalid is, direkt fehler flag setzen und abbrechen
    if (this.registrationForm.invalid) {
      this.registrationFailed = true;
      return;
    }

    // werte aus form holen
    const { username, email, password } = this.registrationForm.value;
    // api-call zum registrieren, subscribe zum fehler/erfolg behandeln
    this.auth.register({ username, email, password })
      .subscribe({
        next: () => this.router.navigate(['/login']), // bei erfolg zur login-seite
        error: () => this.registrationFailed = true  // bei error flag setzen
      });
  }

  // falls user doch zum login will
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}

import { Component }       from '@angular/core';
import { Router }          from '@angular/router';
import { FormBuilder,FormGroup,Validators }      from '@angular/forms';
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
  registrationForm: FormGroup;
  registrationFailed = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  registerUser(): void {
    if (this.registrationForm.invalid) {
      this.registrationFailed = true;
      return;
    }

    const { username, email, password } = this.registrationForm.value;
    this.auth.register({ username, email, password })
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: () => this.registrationFailed = true
      });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}

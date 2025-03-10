import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DarkModeService } from '../../../core/services/dark-modeServices/dark-mode.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  scrolled: boolean = false;

  constructor(
    private router: Router,
    private darkModeService: DarkModeService,
    private authService: AuthService
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

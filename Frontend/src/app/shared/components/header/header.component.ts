import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DarkModeService } from '../../../core/services/dark-modeServices/dark-mode.service';
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  scrolled: boolean = false;

  constructor(private router: Router, private darkModeService: DarkModeService) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Falls wir nach unten gescrollt haben, setze `scrolled` auf true (kleinerer Header)
    this.scrolled = window.scrollY > 50;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }
}

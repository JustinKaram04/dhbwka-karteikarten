import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DarkModeService } from '../../../core/services/dark-modeServices/dark-mode.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToDoFlashcardComponent } from '../../../features/to-do-flashcard/to-do-flashcard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [ToDoFlashcardComponent, CommonModule],
})
export class HeaderComponent {
  scrolled: boolean = false;
  showTodoPopup = false;

  constructor(
    private router: Router,// zum navigieren
    private darkModeService: DarkModeService,// um dark mode umzuschalten
    private authService: AuthService// zum logout
  ) {}

  @HostListener('window:scroll', [])// hört aufs scroll-event
  onWindowScroll() {
    // wenn weiter als 50px gescrollt, scrolled auf true setzen
    this.scrolled = window.scrollY > 50;
  }

  navigateTo(route: string) {
    this.router.navigate([route]); // nav zu ner route
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode(); // dark mode an/aus
  }

  toggleTodoPopup() {
    this.showTodoPopup = !this.showTodoPopup;
  }

  logout(): void {
    this.authService.logout();// token löschen
    this.router.navigate(['/login']);// zurück zur login-seite
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { KarteikartenService } from '../../core/services/karteikarten.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  themengebiete: any[] = [];
  activeMenuId: number | null = null;
  hoveredId: number | null = null;

  constructor(private service: KarteikartenService, private router: Router) {}

  ngOnInit() {
    this.service.getThemengebiete().subscribe(data => {
      this.themengebiete = data;
    });
  }

  navigateToThemengebiet(id: number) {
    if (this.activeMenuId) return; // Falls ein Menü offen ist, nicht navigieren
    this.router.navigate(['/themen', id]);
  }

  toggleMenu(id: number, event: MouseEvent) {
    event.stopPropagation(); // Verhindert, dass das Thema geklickt wird
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  closeMenu() {
    this.activeMenuId = null;
  }

  bearbeiten(id: number, event: MouseEvent) {
    event.stopPropagation(); // Verhindert die Navigation
    console.log(`Bearbeiten: ${id}`);
    this.closeMenu();
  }

  loeschen(id: number, event: MouseEvent) {
    event.stopPropagation(); // Verhindert die Navigation
    console.log(`Löschen: ${id}`);
    this.closeMenu();
  }
}

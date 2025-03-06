import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { KarteikartenService } from '../../core/services/karteikarten.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../shared/components/header/header.component";

@Component({
  selector: 'app-themengebiete',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './themengebiete.component.html',
  styleUrl: './themengebiete.component.css'
})
export class ThemengebieteComponent {
  themengebietId!: number;
  themengebietName: string = '';
  unterthemen: any[] = [];
  activeMenuId: number | null = null;
  hoveredId: number | null = null;

  constructor(private route: ActivatedRoute, private service: KarteikartenService, private router: Router) {}

  ngOnInit() {
    this.themengebietId = Number(this.route.snapshot.paramMap.get('id'));

    this.service.getThemengebiete().subscribe(themen => {
      const gefundenesThema = themen.find(t => t.id === this.themengebietId);
      if (gefundenesThema) {
        this.themengebietName = gefundenesThema.name;
      }
    });

    this.service.getUnterthemen(this.themengebietId).subscribe(data => {
      this.unterthemen = data;
    });
  }

  navigateToUnterthema(unterthemaId: number) {
    console.log('➡️ Navigiere zu Unterthema ID:', unterthemaId);
    this.router.navigate(['/themen', this.themengebietId, unterthemaId]);
  }

  toggleMenu(id: number, event: MouseEvent) {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  closeMenu() {
    this.activeMenuId = null;
  }

  bearbeiten(id: number) {
    console.log(`Bearbeiten: ${id}`);
    this.closeMenu();
  }

  loeschen(id: number) {
    console.log(`Löschen: ${id}`);
    this.closeMenu();
  }
}

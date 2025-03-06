import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { ITopic } from '../../core/models/itopic';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, CommonModule, RouterModule],
  standalone : true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  themengebiete$: Observable<ITopic[]>;  // Reaktive Observable-Datenquelle
  hoveredId: string | null = null;
  activeMenuId: string | null = null;

    constructor(private themenService: GetDataService, private router: Router) {
      this.themengebiete$ = this.themenService.getTopics();
    }
  
    navigateToThemengebiet(topicId: string): void {
      this.router.navigate(['/themengebiet', topicId]);
    }
  

  /**
   * Menü ein-/ausblenden
   * @param id ID des Themas
   * @param event Mouse-Event (zum Stoppen der Event-Propagation)
   */
  toggleMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  /**
   * Bearbeiten-Funktion
   * @param id ID des Themas
   * @param event Mouse-Event
   */
  bearbeiten(id: string, event: MouseEvent): void {
    event.stopPropagation();
    console.log('Bearbeiten:', id);
    // Hier könnte ein Navigationsbefehl oder eine Editierlogik stehen
  }

  /**
   * Löschen-Funktion
   * @param id ID des Themas
   * @param event Mouse-Event
   */
  loeschen(id: string, event: MouseEvent): void {
    event.stopPropagation();
    console.log('Löschen:', id);
    // Hier könnte ein Service-Aufruf zum Löschen stehen
  }

  /**
   * Schließt das Menü, wenn außerhalb geklickt wird
   */
  closeMenu(): void {
    this.activeMenuId = null;
  }
}

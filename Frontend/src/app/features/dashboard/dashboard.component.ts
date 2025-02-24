import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { CardComponent } from '../../shared/card/card.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { KarteikartenService } from '../../core/services/karteikarten.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  themengebiete: any[] = [];

  constructor(private service: KarteikartenService, private router: Router) {}

  ngOnInit() {
    this.service.getThemengebiete().subscribe(data => {
      this.themengebiete = data;
    });
  }

  navigateToThemengebiet(id: number) {
    this.router.navigate(['/themen', id]);
  }
  
}


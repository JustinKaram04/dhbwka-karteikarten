import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/generalComponents/sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/generalComponents/header/header.component';
import { GetDataService } from '../../../core/services/getDataServices/get-data.service';
import { Router } from '@angular/router';
import { ITopic } from '../../../core/models/itopic';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  themengebiete: ITopic[] = [];

  constructor(private dataService: GetDataService, private router: Router) {}

  ngOnInit() {
    this.dataService.getTopics().subscribe((data) => {
      this.themengebiete = data;
    });
    console.log(this.themengebiete);
  }

  navigateToThemengebiet(id: string) {
    console.log('Navigating to theme with ID:', id); // Add this for debugging
    this.router.navigate(['/themen', id]);
  }
}
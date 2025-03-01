import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/generalComponents/sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/generalComponents/header/header.component';
import { FlashcardService } from '../../../flashcard.service';
import { Flashcard } from '../../flashcards/components/Flashcard';
import { FlashcardComponent } from '../../flashcards/components/flashcard.component';
import { AddFlashcardComponent } from '../../flashcards/components/add-flashcard/add-flashcard.component';
import { GetDataService } from '../../../core/services/getDataServices/get-data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FlashcardComponent, AddFlashcardComponent, HeaderComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  themengebiete: any[] = [];

  constructor(private dataService: GetDataService, private router: Router) {}

  ngOnInit() {
    this.dataService.getTopics().subscribe((data) => {
      this.themengebiete = data;
    });
    console.log(this.themengebiete);
  }

  navigateToThemengebiet(id: string) {
    this.router.navigate(['/themen', id]);
  }
}
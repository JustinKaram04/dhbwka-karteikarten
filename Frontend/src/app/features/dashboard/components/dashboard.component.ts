import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetDataServiceService } from '../../../core/services/getdataServices/get-data-service.service';
import { Flashcard } from '../../../core/models/Karteikarte';
import { FlashcardComponent } from '../../flashcards/components/flashcard.component';
import { AddFlashcardComponent } from '../../../shared/components/Bearbeitung/add-flashcard/add-flashcard.component';
import { FlashcardListComponent } from '../../flashcards/components/flashcard-list/flashcard-list.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FlashcardComponent, FlashcardListComponent, GetDataServiceService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  flashcards: Flashcard[] = [];

  constructor(private getDataServiceService: GetDataServiceService) {}

  ngOnInit(): void {
    this.getDataServiceService.getFlashcards().subscribe((data) => {
      this.flashcards = data;
    });
    console.log(this.flashcards);
  }
}
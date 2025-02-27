import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Flashcard } from '../../../../core/models/Karteikarte';
import { GetDataServiceService } from '../../../../core/services/getdataServices/get-data-service.service';
import { FlashcardComponent } from '../flashcard.component';

@Component({
  selector: 'app-flashcard-list',
  standalone: true,
  imports: [CommonModule, FlashcardComponent],
  templateUrl: './flashcard-list.component.html',
  styleUrl: './flashcard-list.component.css'
})
export class FlashcardListComponent {
  flashcards: Flashcard[] = [];

  constructor(private getdataServiceService: getdataServiceService) {}

  ngOnInit(): void {
    this.loadFlashcards();
    console.log(this.flashcards);
  }

  loadFlashcards(): void {
    this.getdataServiceService.getFlashcards().subscribe((data) => {
      this.flashcards = data;
    });
  }
}
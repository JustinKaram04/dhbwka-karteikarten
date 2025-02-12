import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Flashcard } from '../Flashcard';
import { FlashcardService } from '../../../../flashcard.service';
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

  constructor(private flashcardService: FlashcardService) {}

  ngOnInit(): void {
    this.loadFlashcards();
    console.log(this.flashcards);
  }

  loadFlashcards(): void {
    this.flashcardService.getFlashcards().subscribe((data) => {
      this.flashcards = data;
    });
  }
}
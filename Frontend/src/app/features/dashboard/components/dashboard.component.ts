import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardService } from '../../../flashcard.service';
import { Flashcard } from '../../flashcards/components/Flashcard';
import { FlashcardComponent } from '../../flashcards/components/flashcard.component';
import { AddFlashcardComponent } from '../../flashcards/components/add-flashcard/add-flashcard.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FlashcardComponent, AddFlashcardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  flashcards: Flashcard[] = [];

  constructor(private flashcardService: FlashcardService) {}

  ngOnInit(): void {
    this.flashcardService.getFlashcards().subscribe((data) => {
      this.flashcards = data;
    });
    console.log(this.flashcards);
  }
}
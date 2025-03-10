import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { IFlashcard } from '../../core/models/iflashcard';
import { Observable, tap } from 'rxjs';
import { WeightedRandomSelectionService } from '../../core/services/Selection/weighted-random-selection.service';

@Component({
  selector: 'app-flashcard-preview',
  standalone: true,
  imports: [],
  templateUrl: './flashcard-preview.component.html',
  styleUrl: './flashcard-preview.component.css'
})
export class FlashcardPreviewComponent implements OnInit{
  isFlipped = false;
  leftClicked = false;
  rightClicked = false;
  topicId: string = '';
  subtopicId: string = '';
  currentFlashcard: IFlashcard | null = null;
  flashcards: IFlashcard[]= [];

  constructor(private route: ActivatedRoute, private service: GetDataService, private selectionService: WeightedRandomSelectionService<IFlashcard>) {}

  ngOnInit() {
    this.route.parent?.params.subscribe(params => {
      this.topicId = params['topicId'] ?? null;
      this.subtopicId = params['subtopicId'] ?? null;
      console.log(this.subtopicId);

    if (this.subtopicId) {
      this.service.getFlashcards(this.subtopicId).subscribe({
        next: (flashcards) => {
          this.flashcards = flashcards;
          console.log('Fetched flashcards:', this.flashcards); // Now shows actual data
          this.selectionService.initialize(this.flashcards); // Initialize AFTER getting flashcards
          this.currentFlashcard = this.selectionService.nextCard() || null; // Get first card
          console.log('Current flashcard:', this.currentFlashcard);
          },
          error: (err) => {
            console.error('Error fetching flashcards:', err);
          }
        });
      }
    });
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }

  previousCard() {
    this.leftClicked = true;
    setTimeout(() => {
      this.leftClicked = false;
      this.currentFlashcard = this.selectionService.previousCard();
    }, 150);
  }

  nextCard() {
    this.rightClicked = true;
    this.isFlipped = false;
    setTimeout(() => {
      this.rightClicked = false;
      this.currentFlashcard = this.selectionService.nextCard();
    }, 150);
  }
}
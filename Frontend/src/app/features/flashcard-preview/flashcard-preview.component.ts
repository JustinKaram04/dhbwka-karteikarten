import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { IFlashcard } from '../../core/models/iflashcard';
import { WeightedRandomSelectionService } from '../../core/services/Selection/weighted-random-selection.serivce';

@Component({
  selector: 'app-flashcard-preview',
  standalone: true,
  imports: [],
  templateUrl: './flashcard-preview.component.html',
  styleUrls: ['./flashcard-preview.component.css']
})
export class FlashcardPreviewComponent implements OnInit {
  isFlipped = false;
  leftClicked = false;
  rightClicked = false;
  topicId: string = '';
  subtopicId: string = '';
  currentFlashcard: IFlashcard | null = null;
  flashcards: IFlashcard[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: GetDataService,
    private selectionService: WeightedRandomSelectionService<IFlashcard>
  ) {}

  ngOnInit() {
    // Beide Parameter (topicId und subtopicId) aus den übergeordneten Routen auslesen
    this.route.parent?.params.subscribe(params => {
      this.topicId = params['topicId'] || '';
      this.subtopicId = params['subtopicId'] || '';
      console.log("Subtopic-ID:", this.subtopicId);

      if (this.topicId && this.subtopicId) {
        // Beide IDs an getFlashcards übergeben
        this.service.getFlashcards(this.topicId, this.subtopicId).subscribe({
          next: (flashcards) => {
            this.flashcards = flashcards;
            console.log('Fetched flashcards:', this.flashcards);
            // Initialisiere die Auswahlfunktionalität mit den erhaltenen Karteikarten
            this.selectionService.initialize(this.flashcards);
            this.currentFlashcard = this.selectionService.nextCard() || null;
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

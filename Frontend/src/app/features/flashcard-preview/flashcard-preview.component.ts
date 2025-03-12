import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { IFlashcard } from '../../core/models/iflashcard';
import { WeightedRandomSelectionService } from '../../core/services/Selection/weighted-random-selection.service';
import { Router } from '@angular/router';


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
  learningProgress: number = 0;
  topicId: string = '';
  subtopicId: string = '';
  currentFlashcard: IFlashcard | null = null;
  flashcards: IFlashcard[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: GetDataService,
    private selectionService: WeightedRandomSelectionService<IFlashcard>
  ) {}

  ngOnInit() {
    // Beide Parameter (topicId und subtopicId) aus den übergeordneten Routen auslesen
    this.topicId = this.route.snapshot.paramMap.get('topicId') || '';
    this.subtopicId = this.route.snapshot.paramMap.get('subtopicId') || '';
      console.log("Subtopic-ID:", this.subtopicId, "Topic-ID:", this.topicId);

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
            this.getProgress();
          },
          error: (err) => {
            console.error('Error fetching flashcards:', err);
          }
        });
      }
    
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }

  previousCard() {
    this.leftClicked = true;
    setTimeout(() => {
      this.leftClicked = false;
      this.currentFlashcard = this.selectionService.previousCard();
      this.getProgress();
    }, 150);
  }

  nextCard() {
    this.rightClicked = true;
    this.isFlipped = false;
    setTimeout(() => {
      this.rightClicked = false;
      this.currentFlashcard = this.selectionService.nextCard();
      this.getProgress();
    }, 150);
  }

  getProgress(): void {
    this.learningProgress = this.currentFlashcard?.learningProgress || 0;
  }

  changeProgress(progress: number): void {
    if (progress<0 && this.learningProgress>0) {
      this.learningProgress =-1;
      this.service.updateLearningProgress(this.topicId, this.subtopicId, this.currentFlashcard?.id || '', this.learningProgress);
      this.nextCard();
    } else if (progress>0 && this.learningProgress<6) {
      this.learningProgress =+1;
      this.service.updateLearningProgress(this.topicId, this.subtopicId, this.currentFlashcard?.id || '', this.learningProgress);
      this.nextCard();
    }
    else {
      this.nextCard();
    }
  }

  getBarProgressPercentage(): number {
    switch (this.learningProgress) {
      case 1:
        return 16;
      case 2:
        return 33;
      case 3:
        return 50;
      case 4:
        return 66;
      case 5:
        return 83;
      case 6:
        return 100;
      default:
        return 0; // Fallback in case of invalid input
    }
  }

  closeLernmodus() {
    // Zurück zur vorherigen Seite navigieren
    this.router.navigate([
      '/themengebiet', 
      this.topicId, 
      this.subtopicId
    ]);
  }
}

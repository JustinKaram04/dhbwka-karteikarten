import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { IFlashcard } from '../../core/models/iflashcard';
import { WeightedRandomSelectionService } from '../../core/services/Selection/weighted-random-selection.service';
import Chart from 'chart.js/auto';
import { DarkModeService } from '../../core/services/dark-modeServices/dark-mode.service';

@Component({
  selector: 'app-flashcard-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flashcard-preview.component.html',
  styleUrls: ['./flashcard-preview.component.css']
})
export class FlashcardPreviewComponent implements OnInit, AfterViewInit {
  toggleFlip(): void { this.isFlipped = !this.isFlipped; }
  nextCard(): void { this.next(); }
  previousCard(): void { this.previous(); }
  @ViewChild('resultCanvas') resultCanvas!: ElementRef<HTMLCanvasElement>;

  flashcards: IFlashcard[] = [];
  currentFlashcard: IFlashcard | null = null;
  learningProgress = 0;
  correctCount = 0;
  totalCount = 0;
  mode: 'infinite' | 'limited' | null = null;
  endScreen = false;
  isFlipped = false;
  leftClicked = false;
  rightClicked = false;
  isDark = false;
  private chart: Chart | null = null;

  private topicId!: string;
  private subtopicId!: string;

  constructor(
    private service: GetDataService,
    private selection: WeightedRandomSelectionService<IFlashcard>,
    private route: ActivatedRoute,
    private router: Router,
    private darkModeService: DarkModeService
  ) {}

  ngOnInit(): void {
    this.topicId = this.route.snapshot.paramMap.get('topicId') || '';
    this.subtopicId = this.route.snapshot.paramMap.get('subtopicId') || '';
    this.service.getFlashcards(this.topicId, this.subtopicId)
      .subscribe(cards => this.flashcards = cards);
  }

  ngAfterViewInit(): void {}

  selectMode(mode: 'infinite' | 'limited'): void {
    this.mode = mode;
    this.selection.initialize(this.flashcards, mode);
    if (mode === 'limited') {
      this.totalCount = this.flashcards.filter(c => c.learningProgress < 6).length;
    }
    this.next();
  }

  next(): void {
    const next = this.selection.nextCard();
    if (!next && this.mode === 'limited') {
      this.endScreen = true;
      setTimeout(() => this.renderChart(), 100);
    } else {
      this.currentFlashcard = next || null;
      this.updateProgress();
    }
  }

  previous(): void {
    const prev = this.selection.previousCard();
    if (prev) {
      this.currentFlashcard = prev;
      this.updateProgress();
    }
  }

  updateProgress(): void {
    this.learningProgress = this.currentFlashcard?.learningProgress || 0;
  }

  changeProgress(delta: number): void {
    if (!this.currentFlashcard) return;
    const card = this.currentFlashcard;
    const newVal = Math.max(0, Math.min(6, card.learningProgress + delta));
    card.learningProgress = newVal;
    this.learningProgress = newVal;
    this.service.updateLearningProgress(this.topicId, this.subtopicId, card.id, newVal)
      .subscribe(() => {
        if (this.mode === 'limited' && delta > 0) {
          this.correctCount++;
        }
        this.next();
      });
  }

  renderChart(): void {
    if (!this.resultCanvas) return;
    if (this.chart) this.chart.destroy();
    const ctx = this.resultCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Richtig', 'Falsch'],
        datasets: [{
          data: [this.correctCount, this.totalCount - this.correctCount],
          backgroundColor: ['#2ecc71', '#e74c3c']
        }]
      },
      options: { responsive: true }
    });
  }

  retry(): void {
    this.endScreen = false;
    this.correctCount = 0;
    this.chart?.destroy();
    this.selection.reset();
    this.next();
  }

  close(): void {
    this.router.navigate(['/themengebiet', this.topicId, this.subtopicId]);
  }
}

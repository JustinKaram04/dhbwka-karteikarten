import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { IFlashcard } from '../../core/models/iflashcard';
import { Observable, of, firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { DarkModeService } from '../../core/services/dark-modeServices/dark-mode.service';

@Component({
  selector: 'app-flashcards-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './flashcards-list.component.html',
  styleUrls: ['./flashcards-list.component.scss']
})
export class FlashcardsListComponent implements OnInit {
  // Reset all learning progress to 0
  resetAllProgress(): void {
    if (!confirm('Möchtest du wirklich alle Lernstände auf 0 zurücksetzen?')) return;
    this.flashcards$.pipe(take(1)).subscribe(cards => {
      cards.forEach(card => {
        this.service.updateLearningProgress(
          this.topicId, this.subtopicId, card.id, 0
        ).subscribe();
      });
      this.loadFlashcards();
    });
  }
  
  // Start editing a specific card
  startEditing(card: IFlashcard, event: MouseEvent): void {
    event.stopPropagation();
    this.editingCardId = card.id;
    this.editedQuestion = card.question;
    this.editedAnswer = card.answer;
  }
  topicId!: string;
  subtopicId!: string;
  flashcards$: Observable<IFlashcard[]> = of([]);
  searchQuery = '';
  sortCriteria = 'question-asc';
  hoveredId: string | null = null;
  activeMenuId: string | null = null;
  showAddCardInput = false;
  newQuestion = '';
  newAnswer = '';
  editingCardId: string | null = null;
  editedQuestion = '';
  editedAnswer = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: GetDataService,
    private darkModeService: DarkModeService
  ) {}

  ngOnInit(): void {
    this.topicId = this.route.snapshot.paramMap.get('topicId') || '';
    this.subtopicId = this.route.snapshot.paramMap.get('subtopicId') || '';
    this.loadFlashcards();
  }

  loadFlashcards(): void {
    this.flashcards$ = this.service.getFlashcards(this.topicId, this.subtopicId);
  }

  applyFilters(): IFlashcard[] {
    let cards: IFlashcard[] = [];
    this.flashcards$.pipe(take(1)).subscribe(data => cards = data);
    const result = cards.filter(c =>
      !this.searchQuery ||
      c.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      c.answer.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    return this.sortCards(result);
  }

  private sortCards(cards: IFlashcard[]): IFlashcard[] {
    switch (this.sortCriteria) {
      case 'question-asc': return cards.sort((a, b) => a.question.localeCompare(b.question));
      case 'question-desc': return cards.sort((a, b) => b.question.localeCompare(a.question));
      case 'answer-asc': return cards.sort((a, b) => a.answer.localeCompare(b.answer));
      case 'answer-desc': return cards.sort((a, b) => b.answer.localeCompare(a.answer));
      case 'progress-asc': return cards.sort((a, b) => a.learningProgress - b.learningProgress);
      case 'progress-desc': return cards.sort((a, b) => b.learningProgress - a.learningProgress);
      default: return cards;
    }
  }

  updateSortOption(event: Event): void {
    this.sortCriteria = (event.target as HTMLSelectElement).value;
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  openLernmodus(): void {
    this.router.navigate([`/themengebiet/${this.topicId}/${this.subtopicId}/lernmodus`]);
  }

  toggleMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  addCard(): void {
    if (!this.newQuestion.trim() || !this.newAnswer.trim()) return;
    firstValueFrom(this.service.getFlashcards(this.topicId, this.subtopicId).pipe(take(1))).then(cards => {
      const maxId = cards.map(c => +c.id).filter(n => !isNaN(n)).reduce((p, c) => c > p ? c : p, 0);
      const newCard: IFlashcard = { id: (maxId + 1).toString(), question: this.newQuestion.trim(), answer: this.newAnswer.trim(), istoggled: false, learningProgress: 0 };
      this.service.addFlashcard(this.topicId, this.subtopicId, newCard).pipe(take(1)).subscribe(() => {
        this.newQuestion = '';
        this.newAnswer = '';
        this.showAddCardInput = false;
        this.loadFlashcards();
      });
    });
  }

  cancelEditing(): void {
    this.editingCardId = null;
    this.activeMenuId = null;
  }

  saveCard(): void {
    if (!this.editingCardId) return;
    this.service.updateFlashcard(
      this.topicId,
      this.subtopicId,
      this.editingCardId,
      { question: this.editedQuestion.trim(), answer: this.editedAnswer.trim() }
    ).pipe(take(1)).subscribe(() => {
      this.editingCardId = null;
      this.activeMenuId = null;
      this.loadFlashcards();
    });
  }

  deleteCard(cardId: string, event: MouseEvent): void {
    event.stopPropagation();
    if (!confirm('Soll diese Karte wirklich gelöscht werden?')) return;
    this.service.deleteFlashcard(this.topicId, this.subtopicId, cardId).pipe(take(1)).subscribe(() => {
      this.activeMenuId = null;
      this.loadFlashcards();
    });
  }
}

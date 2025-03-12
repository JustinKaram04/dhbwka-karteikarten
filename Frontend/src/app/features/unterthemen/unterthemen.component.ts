import { Component, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { Observable, of, firstValueFrom } from 'rxjs';
import { IFlashcard } from '../../core/models/iflashcard';
import { take, switchMap, map, tap } from 'rxjs/operators';
import { DarkModeService } from '../../core/services/dark-modeServices/dark-mode.service';

@Component({
  selector: 'app-unterthemen',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './unterthemen.component.html',
  styleUrls: ['./unterthemen.component.scss']
})
export class UnterthemenComponent {
  topicId!: string;
  subtopicId!: string;
  flashcards$: Observable<IFlashcard[]> = of([]);
  searchQuery: string = '';
  sortCriteria: string = 'question-asc';
  hoveredId: string | null = null;
  activeMenuId: string | null = null;
  showAddCardInput: boolean = false;
  newQuestion: string = '';
  newAnswer: string = '';
  editingCardId: string | null = null;
  editedQuestion: string = '';
  editedAnswer: string = '';

  constructor(
    private route: ActivatedRoute,
    private service: GetDataService,
    private router: Router,
    private ngZone: NgZone,
    private darkModeService: DarkModeService
  ) {}

  ngOnInit(): void {
    this.topicId = this.route.snapshot.paramMap.get('topicId') || '';
    this.subtopicId = this.route.snapshot.paramMap.get('subtopicId') || '';
    if (this.topicId && this.subtopicId) {
      this.loadFlashcards();
    }
  }

  loadFlashcards(): void {
    this.flashcards$ = this.service.getFlashcards(this.topicId, this.subtopicId);
  }

  applyFilters(): IFlashcard[] {
    let cards: IFlashcard[] = [];
    this.flashcards$.subscribe(data => cards = data).unsubscribe();
    let filtered = cards;
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(card =>
        card.question.toLowerCase().includes(q) ||
        card.answer.toLowerCase().includes(q) ||
        card.id.toLowerCase().includes(q)
      );
    }
    return this.sortCards(filtered, this.sortCriteria);
  }

  private sortCards(cards: IFlashcard[], criteria: string): IFlashcard[] {
    switch (criteria) {
      case 'question-asc':
        return cards.sort((a, b) => a.question.localeCompare(b.question));
      case 'question-desc':
        return cards.sort((a, b) => b.question.localeCompare(a.question));
      case 'answer-asc':
        return cards.sort((a, b) => a.answer.localeCompare(b.answer));
      case 'answer-desc':
        return cards.sort((a, b) => b.answer.localeCompare(a.answer));
      default:
        return cards;
    }
  }

  updateSortOption(event: Event): void {
    this.sortCriteria = (event.target as HTMLSelectElement).value;
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  toggleMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  startEditing(card: IFlashcard, event: MouseEvent): void {
    event.stopPropagation();
    this.editingCardId = card.id;
    this.editedQuestion = card.question;
    this.editedAnswer = card.answer;
    this.activeMenuId = null;
  }

  async saveCard(): Promise<void> {
    if (!this.editingCardId || !this.editedQuestion.trim()) return;
    try {
      await firstValueFrom(this.service.updateFlashcard(
        this.topicId,
        this.subtopicId,
        this.editingCardId,
        { question: this.editedQuestion.trim(), answer: this.editedAnswer.trim() }
      ));
      this.editingCardId = null;
      this.activeMenuId = null;
      this.loadFlashcards();
    } catch (err) {
      console.error(err);
    }
  }

  cancelEditing(): void {
    this.editingCardId = null;
    this.activeMenuId = null;
  }

  async deleteCard(cardId: string, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    if (!confirm('Soll diese Flashcard wirklich gelöscht werden?')) return;
    try {
      await firstValueFrom(this.service.deleteFlashcard(this.topicId, this.subtopicId, cardId));
      this.activeMenuId = null;
      this.loadFlashcards();
    } catch (err) {
      console.error(err);
    }
  }

  private generateNextFlashcardId(): Observable<string> {
    return this.service.getFlashcards(this.topicId, this.subtopicId).pipe(
      take(1),
      map(flashcards => {
        if (!flashcards || flashcards.length === 0) {
          return '1';
        }
        const validIds = flashcards
          .map(card => parseInt(card.id, 10))
          .filter(n => !isNaN(n));
        const maxId = validIds.length > 0 ? Math.max(...validIds) : 0;
        return (maxId + 1).toString();
      })
    );
  }

  async addCard(): Promise<void> {
    if (!this.newQuestion.trim() || !this.newAnswer.trim()) return;
    
    const newId = await firstValueFrom(this.generateNextFlashcardId());
    
    const newCard: IFlashcard = {
      id: newId,
      question: this.newQuestion.trim(),
      answer: this.newAnswer.trim(),
      istoggled: false,
      learningProgress: 0
    };
    
    try {
      await firstValueFrom(this.service.addFlashcard(this.topicId, this.subtopicId, newCard));
      this.newQuestion = '';
      this.newAnswer = '';
      this.showAddCardInput = false;
      this.loadFlashcards();
    } catch (err) {
      console.error(err);
    }
  }

  openLernmodus(): void {
    this.router.navigate([`/themengebiet/${this.topicId}/${this.subtopicId}/Lernmodus`]);
  }
}
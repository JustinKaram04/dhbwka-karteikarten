// src/app/features/flashcards-list/flashcards-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SearchSortPipe } from '../../shared/components/search-sort-pipe/search-sort.pipe';
import { AddItemComponent } from '../../shared/components/add-item/add-item.component';
import { EditableCardComponent } from '../../shared/components/editable-card/editable-card.component';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { IFlashcard } from '../../core/models/iflashcard';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'app-flashcards-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,            // für routerLink
    HeaderComponent,
    SearchSortPipe,
    AddItemComponent,
    EditableCardComponent
  ],
  templateUrl: './flashcards-list.component.html',
  styleUrls: ['./flashcards-list.component.scss']
})
export class FlashcardsListComponent implements OnInit, OnDestroy {
  topicId!: number;
  subtopicId!: number;

  allCards: IFlashcard[] = [];
  searchQuery = '';
  sortCriteria = 'question-asc';

  activeMenuId: number | null = null;
  editingCardId: number | null = null;
  editedQuestion = '';
  editedAnswer = '';

  private cardsSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: GetDataService
  ) {}

  ngOnInit(): void {
    this.topicId    = +this.route.snapshot.paramMap.get('topicId')!;
    this.subtopicId = +this.route.snapshot.paramMap.get('subtopicId')!;
    this.cardsSub = this.service
      .getFlashcards(this.topicId, this.subtopicId)
      .subscribe(cards => this.allCards = cards);
  }

  ngOnDestroy(): void {
    this.cardsSub?.unsubscribe();
  }

openLernmodus(): void {
  console.log('Navigiere zu Lernmodus für Topic', this.topicId, 'Subtopic', this.subtopicId);
  this.router.navigate(
    ['lernmodus'],
    { relativeTo: this.route }
  );
}
  /** eine Ebene zurück */
  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  /** Sortierkriterium aus dem Select übernehmen */
  onSortChange(e: Event): void {
    this.sortCriteria = (e.target as HTMLSelectElement).value;
  }

  /** Menü schließen bei Klick außerhalb */
  closeMenu(): void {
    this.activeMenuId = null;
  }

  toggleMenu(id: number, e: MouseEvent): void {
    e.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  onAddFlashcard(data: { name: string; description: string }): void {
    this.service
      .addFlashcard(this.topicId, this.subtopicId, data.name, data.description)
      .subscribe(card => this.allCards.push(card));
  }

  startEditing(card: IFlashcard, e: MouseEvent): void {
    e.stopPropagation();
    this.editingCardId  = card.id;
    this.editedQuestion = card.question;
    this.editedAnswer   = card.answer;
  }

  saveCard(): void {
    if (this.editingCardId == null) return;
    this.service
      .updateFlashcard(
        this.topicId,
        this.subtopicId,
        this.editingCardId,
        { question: this.editedQuestion.trim(), answer: this.editedAnswer.trim() }
      )
      .subscribe(updated => {
        const idx = this.allCards.findIndex(c => c.id === this.editingCardId);
        if (idx > -1) this.allCards[idx] = updated;
        this.editingCardId = null;
        this.activeMenuId  = null;
      });
  }

  cancelEditing(): void {
    this.editingCardId = null;
    this.activeMenuId  = null;
  }

  deleteCard(cardId: number, e: MouseEvent): void {
    e.stopPropagation();
    if (!confirm('Soll diese Karte wirklich gelöscht werden?')) return;
    this.service
      .deleteFlashcard(this.topicId, this.subtopicId, cardId)
      .subscribe(() => {
        this.allCards = this.allCards.filter(c => c.id !== cardId);
        this.activeMenuId = null;
      });
  }

  resetAllProgress(): void {
    if (!confirm('Möchtest du wirklich alle Lernstände zurücksetzen?')) return;
    const calls = this.allCards.map(c =>
      this.service.updateLearningProgress(this.topicId, this.subtopicId, c.id, 0)
    );
    forkJoin(calls).subscribe(() =>
      this.allCards.forEach(c => c.learningProgress = 0)
    );
  }
}

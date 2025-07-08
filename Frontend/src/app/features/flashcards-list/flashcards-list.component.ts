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
    RouterModule,
    HeaderComponent,
    SearchSortPipe,
    AddItemComponent,
    EditableCardComponent
  ],
  templateUrl: './flashcards-list.component.html',
  styleUrls: ['./flashcards-list.component.css']
})
export class FlashcardsListComponent implements OnInit, OnDestroy {
  topicId!: number;  // id vom aktuellen topic aus der url
  subtopicId!: number;  // id vom aktuellen subtopic aus der url
  allCards: IFlashcard[] = [];  // alle geladenen karten zum anzeigen

  searchQuery = '';  // suchbegriff für filter-pipe
  sortCriteria = 'question-asc';  // sortierung, format: feld-richtung

  activeMenuId: number | null = null;  // id der karte, bei der das kontext-menü offen ist (edit/delete)
  editingCardId: number | null = null;  // id der karte, die gerade im edit-mode ist
  editedQuestion = '';  // temp-speicher für die editierten werte
  editedAnswer = '';

  // subscription merken, damit wir sie beim destroy unsubscriben
  private cardsSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: GetDataService
  ) {}

  ngOnInit(): void {
    // topicId/subtopicId als number aus den route-params parsen
    this.topicId    = +this.route.snapshot.paramMap.get('topicId')!;
    this.subtopicId = +this.route.snapshot.paramMap.get('subtopicId')!;

    // flashcards vom backend holen und ins allCards-array packen
    this.cardsSub = this.service
      .getFlashcards(this.topicId, this.subtopicId)
      .subscribe(cards => this.allCards = cards);
  }

  ngOnDestroy(): void {
    // subscription beenden sonst fliegt memory leak
    this.cardsSub?.unsubscribe();
  }

  // navigiert in den lernmodus für dieses topic/subtopic
  openLernmodus(): void {
    console.log('Navigiere zu Lernmodus für Topic', this.topicId, 'Subtopic', this.subtopicId);
    this.router.navigate(['lernmodus'], { relativeTo: this.route });
  }

  /** eine ebene zurück in der routenhierarchie */
  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  /** wenn user im sort-select was ändert */
  onSortChange(e: Event): void {
    this.sortCriteria = (e.target as HTMLSelectElement).value;
  }

  /** kontext-menü schließen */
  closeMenu(): void {
    this.activeMenuId = null;
  }

  /** kontext-menü für karten-toggle */
  toggleMenu(id: number, e: MouseEvent): void {
    e.stopPropagation(); // klick nicht an höhere elemente weiterreichen
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  // neue karte hinzufügen über shared AddItemComponent
  onAddFlashcard(data: { name: string; description: string }): void {
    this.service
      .addFlashcard(this.topicId, this.subtopicId, data.name, data.description)
      .subscribe(card => this.allCards.push(card)); // karte ans ende hängen
  }

  // edit-mode starten: felder mit aktuellen werten füllen
  startEditing(card: IFlashcard, e: MouseEvent): void {
    e.stopPropagation();
    this.editingCardId  = card.id;
    this.editedQuestion = card.question;
    this.editedAnswer   = card.answer;
  }

  // speichert die edits auf server und aktualisiert das array
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
        // finde index der bearbeiteten karte und ersetze sie
        const idx = this.allCards.findIndex(c => c.id === this.editingCardId);
        if (idx > -1) this.allCards[idx] = updated;
        // edit-mode und menü schließen
        this.editingCardId = null;
        this.activeMenuId  = null;
      });
  }

  // edit-mode abbrechen ohne speichern
  cancelEditing(): void {
    this.editingCardId = null;
    this.activeMenuId  = null;
  }

  // karte löschen nach bestätigung
  deleteCard(cardId: number, e: MouseEvent): void {
    e.stopPropagation();
    if (!confirm('Soll diese Karte wirklich gelöscht werden?')) return;
    this.service
      .deleteFlashcard(this.topicId, this.subtopicId, cardId)
      .subscribe(() => {
        // entferne karte aus dem array
        this.allCards = this.allCards.filter(c => c.id !== cardId);
        this.activeMenuId = null;
      });
  }

  // setzt bei allen karten den learningProgress auf 0 zurück
  resetAllProgress(): void {
    if (!confirm('Möchtest du wirklich alle Lernstände zurücksetzen?')) return;
    // build array von update-calls
    const calls = this.allCards.map(c =>
      this.service.updateLearningProgress(this.topicId, this.subtopicId, c.id, 0)
    );
    // alle paralllel abfeuern und nachher lokal resetten
    forkJoin(calls).subscribe(() =>
      this.allCards.forEach(c => c.learningProgress = 0)
    );
  }
}

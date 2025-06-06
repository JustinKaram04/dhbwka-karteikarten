import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; //navigation und routen
import { CommonModule } from '@angular/common'; //ng if
import { FormsModule } from '@angular/forms'; //ng model
import { HeaderComponent } from '../../shared/components/header/header.component';  //header
import { GetDataService } from '../../core/services/getDataServices/get-data.service';  //api service
import { IFlashcard } from '../../core/models/iflashcard';  //datenmodell flashcards
import { Subscription, forkJoin } from 'rxjs';  //für subscription

@Component({
  selector: 'app-flashcards-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './flashcards-list.component.html',
  styleUrls: ['./flashcards-list.component.scss']
})
export class FlashcardsListComponent implements OnInit, OnDestroy {
  topicId!: number; //ID aktuelles Thema
  subtopicId!: number;  //ID aktuelles unterthema

  allCards: IFlashcard[] = [];  //alle geladenen Flashcards
  displayedCards: IFlashcard[] = [];  //gefilterte, sotierte liste

  searchQuery = ''; //suchbegriff
  sortCriteria = 'question-asc';  //sotierkriterium

  hoveredId: number | null = null;  //id beim hovern
  activeMenuId: number | null = null; //id von geöffnetem menu

  showAddCardInput = false; //formular zum hinzufügen
  newQuestion = ''; //neue frage beim anlegen
  newAnswer = ''; //neue antwort beim anlegen

  editingCardId: number | null = null;  //ID des karte im bearbeiten modus
  editedQuestion = '';  //geänderte Frage
  editedAnswer = '';  //geänderte Antwort

  private cardsSub: Subscription | null = null; //subscription für laden der karte

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: GetDataService,
  ) {}

  ngOnInit(): void {
    //routen parameter herausnehmen und umwandeln
    const tid = this.route.snapshot.paramMap.get('topicId') || '0';
    this.topicId = parseInt(tid, 10);
    const sid = this.route.snapshot.paramMap.get('subtopicId') || '0';
    this.subtopicId = parseInt(sid, 10);

    this.loadFlashcards();  //flashcards laden
  }

  ngOnDestroy(): void {
    this.cardsSub?.unsubscribe(); //subscription aufräumen
  }

  //lädt alle flashcards vom service
  private loadFlashcards(): void {
    this.cardsSub = this.service
      .getFlashcards(this.topicId, this.subtopicId)
      .subscribe({
        next: cards => {
          this.allCards = cards;  //alle karten setzen
          this.applyFiltersAndSort(); //filtern und sotieren
        },
        error: err => console.error('❌ Fehler beim Laden der Karten:', err)
      });
  }

  //filter und sotierlogik
  applyFiltersAndSort(): void {
    //erst filtern nach frga eoder antwort wenn suchbegriff gesetzt ist
    let filtered = this.allCards.filter(c =>
      !this.searchQuery ||
      c.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      c.answer.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    //dann sotieren nach kriterium
    this.displayedCards = filtered.sort((a, b) => {
      switch (this.sortCriteria) {
        case 'question-asc':   return a.question.localeCompare(b.question);
        case 'question-desc':  return b.question.localeCompare(a.question);
        case 'answer-asc':     return a.answer.localeCompare(b.answer);
        case 'answer-desc':    return b.answer.localeCompare(a.answer);
        case 'progress-asc':   return a.learningProgress - b.learningProgress;
        case 'progress-desc':  return b.learningProgress - a.learningProgress;
        default:               return 0;
      }
    });
  }

  //aufruf wenn suchfeld verändert wird
  onSearchChange(): void {
    this.applyFiltersAndSort();
  }

  //aufruf wenn sotier kriterium geändert wird
  onSortChange(event: Event): void {
    this.sortCriteria = (event.target as HTMLSelectElement).value;
    this.applyFiltersAndSort();
  }

  //zurück zu den unterthemen
  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  //lernmodus starten
  openLernmodus(): void {
    this.router.navigate([`/themengebiet/${this.topicId}/${this.subtopicId}/lernmodus`]);
  }

  //menu ein / ausblenden
  toggleMenu(id: number | null, event: MouseEvent): void {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  //flashcards anlegem
  addCard(): void {
    if (!this.newQuestion.trim() || !this.newAnswer.trim()) return; //wenn delder leer ann abbrechen

    this.service
      .addFlashcard(
        this.topicId,
        this.subtopicId,
        this.newQuestion.trim(),
        this.newAnswer.trim()
      )
      .subscribe({
        next: created => {
          this.allCards.push(created);  //neue karte zur liste hinzufügen
          this.applyFiltersAndSort(); //neu filtern und sotieren
          this.newQuestion = '';
          this.newAnswer = '';
          this.showAddCardInput = false;  //formular verbergen
        },
        error: err => console.error('❌ Fehler beim Anlegen der Karte:', err)
      });
  }

  //bearbeitung abbrechen
  cancelEditing(): void {
    this.editingCardId = null;
    this.activeMenuId = null;
  }

  //bearbeitung starten
  startEditing(card: IFlashcard, event: MouseEvent): void {
    event.stopPropagation();
    this.editingCardId = card.id;
    this.editedQuestion = card.question;
    this.editedAnswer = card.answer;
  }

  //karte speichern
  saveCard(): void {
    if (this.editingCardId === null) return;

    this.service
      .updateFlashcard(
        this.topicId,
        this.subtopicId,
        this.editingCardId,
        { question: this.editedQuestion.trim(), answer: this.editedAnswer.trim() }
      )
      .subscribe({
        next: updated => {
          const idx = this.allCards.findIndex(c => c.id === this.editingCardId);
          if (idx !== -1) {
            this.allCards[idx] = updated;
            this.applyFiltersAndSort(); //neu filtern und sotieren
          }
          this.editingCardId = null;
          this.activeMenuId = null;
        },
        error: err => console.error('❌ Fehler beim Speichern der Karte:', err)
      });
  }

  //flashcard löschen
  deleteCard(cardId: number, event: MouseEvent): void {
    event.stopPropagation();
    if (!confirm('Soll diese Karte wirklich gelöscht werden?')) return;

    this.service
      .deleteFlashcard(this.topicId, this.subtopicId, cardId)
      .subscribe({
        next: () => {
          //aus allcards entfernen und liste aktualisieren
          this.allCards = this.allCards.filter(c => c.id !== cardId);
          this.applyFiltersAndSort();
          this.activeMenuId = null;
        },
        error: err => console.error('❌ Fehler beim Löschen der Karte:', err)
      });
  }

  //alle lernstände auf 0 setzen
  resetAllProgress(): void {
    if (!confirm('Möchtest du wirklich alle Lernstände auf 0 zurücksetzen?')) return;

    //für jede karte ein update-call erzeugen
    const updateCalls = this.allCards.map(card =>
      this.service.updateLearningProgress(
        this.topicId,
        this.subtopicId,
        card.id,
        0
      )
    );

    //alle calls parallel ausführen
    forkJoin(updateCalls).subscribe({
      next: updatedArray => {
        //lokal lernstand aller karten auf 0 setzten
        this.allCards.forEach(card => card.learningProgress = 0);
        this.applyFiltersAndSort(); //neu filtern und sotieren
      },
      error: err => console.error('❌ Fehler beim Zurücksetzen der Lernstände:', err)
    });
  }
}

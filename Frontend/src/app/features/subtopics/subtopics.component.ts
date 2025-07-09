// subtopics.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SearchSortPipe } from '../../shared/components/search-sort-pipe/search-sort.pipe';
import { AddItemComponent } from '../../shared/components/add-item/add-item.component';
import { EditableCardComponent } from '../../shared/components/editable-card/editable-card.component';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { ISubtopic } from '../../core/models/isubtopic';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IFlashcard } from '../../core/models/iflashcard';

@Component({
  selector: 'app-subtopics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    SearchSortPipe,
    AddItemComponent,
    EditableCardComponent
  ],
  templateUrl: './subtopics.component.html',
  styleUrls: ['./subtopics.component.scss']
})
export class SubtopicsComponent implements OnInit {
  topicId!: number; // holt sich die topic-id aus der url
  topicName = ''; // name vom themengebiet, wird später gesetzt
  subtopics$ = new BehaviorSubject<ISubtopic[]>([]); // stream mit allen unterthemen
  activeMenuId: number | null = null; // welche karte hat grad menü offen?

  editingSubtopicId: number | null = null; // id vom unterthema im edit-mode
  editedSubtopicName = ''; // temporärer speicher für neuen namen
  editedSubtopicDescription = ''; // und beschreibung

  searchQuery = ''; // suchbegriff fürs filter-pipe
  sortCriteria = 'id-asc'; // sortierung, standard ist id-aufsteigend

  constructor(
    private route: ActivatedRoute,
    private service: GetDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // topic-id aus param holen, fallback auf 0
    const tid = this.route.snapshot.paramMap.get('topicId') || '0';
    this.topicId = +tid;

    // lade parallel topics und subs
    forkJoin({
      topics: this.service.getTopics(),
      subs: this.service.getSubtopics(this.topicId)
    }).pipe(
      map(({ topics, subs }) => {
        // such das aktuelle topic um an den namen zu kommen
        const topic = topics.find(t => t.id === this.topicId);
        this.topicName = topic?.name || '';
        return subs; // unterthemen weitergeben
      }),
      catchError(() => of([] as ISubtopic[])) // falls fehler, leeres array
    ).subscribe(subs => this.subtopics$.next(subs));
  }

  updateSortOption(e: Event): void {
    // krieg neuen wert vom select
    this.sortCriteria = (e.target as HTMLSelectElement).value;
  }

  closeMenu(): void {
    // klick ausserhalb schließt menü
    this.activeMenuId = null;
  }

  navigateToSubtopic(id: number, e: MouseEvent): void {
    // wenn button/input geklickt wurde, nix tun
    if (['BUTTON','INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
    // sonst navigier zum unterthema
    this.router.navigate(['/themengebiet', this.topicId, id]);
  }

  addSubtopicHandler({ name, description }: { name: string; description: string }): void {
    // neues unterthema anlegen
    this.service.addSubtopic(this.topicId, name, description)
      .subscribe({
        next: created => {
          // ins array appenden
          this.subtopics$.next([...this.subtopics$.value, created]);
        },
        error: err => console.error('oops, fehler beim hinzufügen:', err)
      });
  }

  startEditing(sub: ISubtopic, e: MouseEvent): void {
    // edit-mode starten, werte reinladen
    e.stopPropagation();
    this.editingSubtopicId = sub.id;
    this.editedSubtopicName = sub.name;
    this.editedSubtopicDescription = sub.description || '';
  }

  saveSubtopic(): void {
    if (this.editingSubtopicId == null) return;
    // update auf server
    this.service.updateSubtopic(
      this.topicId,
      this.editingSubtopicId,
      {
        name: this.editedSubtopicName.trim(),
        description: this.editedSubtopicDescription.trim()
      }
    ).subscribe({
      next: updated => {
        // im stream ersetzen
        this.subtopics$.next(
          this.subtopics$.value.map(s =>
            s.id === this.editingSubtopicId ? updated : s
          )
        );
        this.editingSubtopicId = null;
        this.activeMenuId = null;
      },
      error: err => console.error('fehler beim speichern:', err)
    });
  }

  cancelEditing(): void {
    // edit-mode verlassen
    this.editingSubtopicId = null;
    this.activeMenuId = null;
  }

  toggleMenu(id: number, e: MouseEvent): void {
    // menü umschalten
    e.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  deleteSubtopic(subtopicId: number, e: MouseEvent): void {
    // unterthema + flashcards löschen
    e.stopPropagation();
    if (!confirm('wirklich löschen?')) return;

    this.service.getFlashcards(this.topicId, subtopicId).pipe(
      switchMap(cards => {
        const calls = cards.map(c => this.service.deleteFlashcard(this.topicId, subtopicId, c.id));
        return calls.length ? forkJoin(calls) : of(null);
      }),
      switchMap(() => this.service.deleteSubtopic(this.topicId, subtopicId)),
      map(() => {
        // aus liste entfernen
        this.subtopics$.next(this.subtopics$.value.filter(s => s.id !== subtopicId));
      })
    ).subscribe({
      error: err => console.error('fehler beim löschen:', err)
    });
  }

  goBack(): void {
    // zurück zur startseite
    this.router.navigate(['/']);
  }
}

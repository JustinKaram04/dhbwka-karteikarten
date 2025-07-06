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
  topicId!: number;
  themengebietName = '';
  unterthemen$ = new BehaviorSubject<ISubtopic[]>([]);
  activeMenuId: number | null = null;

  editingSubtopicId: number | null = null;
  editedSubtopicName = '';
  editedSubtopicDescription = '';

  searchQuery = '';
  sortCriteria = 'id-asc';

  constructor(
    private route: ActivatedRoute,
    private service: GetDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const tid = this.route.snapshot.paramMap.get('topicId') || '0';
    this.topicId = +tid;

    forkJoin({
      topics: this.service.getTopics(),
      subs: this.service.getSubtopics(this.topicId)
    }).pipe(
      map(({ topics, subs }) => {
        const topic = topics.find(t => t.id === this.topicId);
        this.themengebietName = topic?.name || '';
        return subs;
      }),
      catchError(() => of([] as ISubtopic[]))
    ).subscribe(subs => this.unterthemen$.next(subs));
  }

  updateSortOption(e: Event): void {
    this.sortCriteria = (e.target as HTMLSelectElement).value;
  }

  navigateToUnterthema(id: number, e: MouseEvent): void {
    if (['BUTTON','INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
    this.router.navigate(['/themengebiet', this.topicId, id]);
  }

  addSubtopicHandler({ name, description }: { name: string; description: string }): void {
    this.service.addSubtopic(this.topicId, name, description)
      .subscribe({
        next: created => this.unterthemen$.next([...this.unterthemen$.value, created]),
        error: err    => console.error('❌ Fehler beim Hinzufügen des Unterthemas:', err)
      });
  }

  startEditing(sub: ISubtopic, e: MouseEvent): void {
    e.stopPropagation();
    this.editingSubtopicId = sub.id;
    this.editedSubtopicName = sub.name;
    this.editedSubtopicDescription = sub.description || '';
  }

  saveSubtopic(): void {
    if (this.editingSubtopicId == null) return;
    this.service.updateSubtopic(
      this.topicId,
      this.editingSubtopicId,
      {
        name:        this.editedSubtopicName.trim(),
        description: this.editedSubtopicDescription.trim()
      }
    ).subscribe({
      next: updated => {
        this.unterthemen$.next(
          this.unterthemen$.value.map(s =>
            s.id === this.editingSubtopicId ? updated : s
          )
        );
        this.editingSubtopicId = null;
        this.activeMenuId      = null;
      },
      error: err => console.error('❌ Fehler beim Speichern des Unterthemas:', err)
    });
  }

  cancelEditing(): void {
    this.editingSubtopicId = null;
    this.activeMenuId      = null;
  }

  toggleMenu(id: number, e: MouseEvent): void {
    e.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  loeschen(subtopicId: number, e: MouseEvent): void {
    e.stopPropagation();
    if (!confirm('❗ Wirklich löschen?')) return;

    this.service.getFlashcards(this.topicId, subtopicId).pipe(
      switchMap((cards: IFlashcard[]) => {
        const calls = cards.map((c: IFlashcard) => this.service.deleteFlashcard(this.topicId, subtopicId, c.id));
        return calls.length ? forkJoin(calls) : of(null);
      }),
      switchMap(() => this.service.deleteSubtopic(this.topicId, subtopicId)),
      map(() => this.unterthemen$.next(
        this.unterthemen$.value.filter(s => s.id !== subtopicId)
      ))
    ).subscribe({ error: err => console.error('❌ Fehler beim Löschen des Unterthemas:', err) });
  }

  closeMenu(): void {
    this.activeMenuId = null;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
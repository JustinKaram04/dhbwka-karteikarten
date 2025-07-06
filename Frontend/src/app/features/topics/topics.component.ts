import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SearchSortPipe } from '../../shared/components/search-sort-pipe/search-sort.pipe';
import { AddItemComponent } from '../../shared/components/add-item/add-item.component';
import { EditableCardComponent } from '../../shared/components/editable-card/editable-card.component';
import { Observable, Subject, of } from 'rxjs';
import { catchError, startWith, switchMap, shareReplay, map } from 'rxjs/operators';
import { ITopic } from '../../core/models/itopic';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    SearchSortPipe,
    AddItemComponent,
    EditableCardComponent
  ],
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  private reloadTrigger$ = new Subject<void>();
  topics$!: Observable<ITopic[]>;
  filteredTopics$!: Observable<ITopic[]>;

  hoveredId: number | null = null;
  activeMenuId: number | null = null;

  editingTopicId: number | null = null;
  editedTopicName = '';
  editedTopicDescription = '';

  searchQuery = '';
  sortCriteria = 'name-asc';
  isAddingTopic = false;

  constructor(
    private themenService: GetDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.topics$ = this.reloadTrigger$.pipe(
      startWith(void 0),
      switchMap(() =>
        this.themenService.getTopics().pipe(
          catchError(() => of([] as ITopic[]))
        )
      ),
      shareReplay(1)
    );

    // Stelle sicher, dass niemals null weitergereicht wird
    this.filteredTopics$ = this.topics$.pipe(
      map(items => items ?? [])
    );
  }

  updateSearchQuery(e: Event): void {
    this.searchQuery = (e.target as HTMLInputElement).value;
  }

  updateSortCriteria(e: Event): void {
    this.sortCriteria = (e.target as HTMLSelectElement).value;
  }

  navigateToTopic(id: number, e: MouseEvent): void {
    if (!['BUTTON','INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
      this.router.navigate(['/themengebiet', id]);
    }
  }

  toggleMenu(id: number, e: MouseEvent): void {
    e.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  closeMenu(): void {
    this.activeMenuId = null;
  }

  startEditing(topic: ITopic, e: MouseEvent): void {
    e.stopPropagation();
    this.editingTopicId = topic.id;
    this.editedTopicName = topic.name;
    this.editedTopicDescription = topic.description || '';
  }

  saveTopic(): void {
    if (this.editingTopicId == null) return;
    this.themenService.updateTopic(
      this.editingTopicId,
      {
        name: this.editedTopicName.trim(),
        description: this.editedTopicDescription.trim()
      }
    ).subscribe({
      next: () => {
        this.reloadTrigger$.next();
        this.editingTopicId = null;
      },
      error: err => console.error('❌ Fehler beim Speichern:', err)
    });
  }

  deleteTopic(id: number, e: MouseEvent): void {
    e.stopPropagation();
    if (!confirm('Soll dieses Thema wirklich gelöscht werden?')) return;
    this.themenService.deleteTopic(id).subscribe({
      next: () => {
        this.activeMenuId = null;
        this.reloadTrigger$.next();
      },
      error: err => console.error('❌ Fehler beim Löschen:', err)
    });
  }

  addTopicHandler({ name, description }: { name: string; description: string }) {
    this.isAddingTopic = true;
    this.themenService.addTopic(name, description).subscribe({
      next: () => this.reloadTrigger$.next(),
      error: err => console.error('❌ Fehler beim Anlegen:', err),
      complete: () => this.isAddingTopic = false
    });
  }

  cancelEditing(): void {
    this.editingTopicId = null;
  }
}
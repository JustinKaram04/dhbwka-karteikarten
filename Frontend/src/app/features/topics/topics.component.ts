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
  private reloadTrigger$ = new Subject<void>(); // trigger zum neu laden wird gleich gestartet
  topics$!: Observable<ITopic[]>;// stream mit allen topics
  filteredTopics$!: Observable<ITopic[]>;// wird später zum filtern benutzt

  hoveredId: number | null = null;// id über die grad gehovt wird (für styling)
  activeMenuId: number | null = null;// welches menü ist offen?

  editingTopicId: number | null = null;// id vom topic das grad editiert wird
  editedTopicName = '';// temporärer name beim bearbeiten
  editedTopicDescription = '';// und description

  searchQuery = '';// text aus der suche
  sortCriteria = 'name-asc';// wie sortiert wird (name aufsteigend)
  isAddingTopic = false;// flag, wenn grad neues topic angelegt wird

  constructor(
    private themenService: GetDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // topics$ stream aufsetzen, lädt data und cached mit shareReplay
    this.topics$ = this.reloadTrigger$.pipe(
      startWith(void 0), // direkt beim start triggern
      switchMap(() =>
        this.themenService.getTopics().pipe(
          catchError(() => of([] as ITopic[])) // falls fehler, leeres array
        )
      ),
      shareReplay(1) // letzte liste immer wiederverwenden
    );

    // filteredTopics$ ist gleich topics$, nur sicher kein null
    this.filteredTopics$ = this.topics$.pipe(
      map(items => items ?? [])
    );
  }

  updateSearchQuery(e: Event): void {
    // wenn user tippt, update die suche
    this.searchQuery = (e.target as HTMLInputElement).value;
  }

  updateSortCriteria(e: Event): void {
    // sort-wechsel verarbeiten
    this.sortCriteria = (e.target as HTMLSelectElement).value;
  }

  navigateToTopic(id: number, e: MouseEvent): void {
    // nur navigieren, wenn nicht gerade button oder input geklickt wurde
    if (!['BUTTON','INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
      this.router.navigate(['/themengebiet', id]);
    }
  }

  toggleMenu(id: number, e: MouseEvent): void {
    // menü-toggle, klick nicht nach oben leiten
    e.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  closeMenu(): void {
    // menü schließen
    this.activeMenuId = null;
  }

  startEditing(topic: ITopic, e: MouseEvent): void {
    // in den edit-mode wechseln
    e.stopPropagation();
    this.editingTopicId = topic.id;
    this.editedTopicName = topic.name;
    this.editedTopicDescription = topic.description || '';
  }

  saveTopic(): void {
    // wenn edit active, speichern und neu laden
    if (this.editingTopicId == null) return;
    this.themenService.updateTopic(
      this.editingTopicId,
      {
        name: this.editedTopicName.trim(),
        description: this.editedTopicDescription.trim()
      }
    ).subscribe({
      next: () => {
        this.reloadTrigger$.next(); // neu triggern
        this.editingTopicId = null;
      },
      error: err => console.error('❌ fehler beim speichern:', err)
    });
  }

  deleteTopic(id: number, e: MouseEvent): void {
    // topic löschen nach bestätigung
    e.stopPropagation();
    if (!confirm('willst du das thema wirklich löschen?')) return;
    this.themenService.deleteTopic(id).subscribe({
      next: () => {
        this.activeMenuId = null;
        this.reloadTrigger$.next(); // neu laden
      },
      error: err => console.error('❌ fehler beim löschen:', err)
    });
  }

  addTopicHandler({ name, description }: { name: string; description: string }) {
    // neues topic erstellen
    this.isAddingTopic = true;
    this.themenService.addTopic(name, description).subscribe({
      next: () => this.reloadTrigger$.next(),
      error: err => console.error('❌ fehler beim anlegen:', err),
      complete: () => this.isAddingTopic = false
    });
  }

  cancelEditing(): void {
    // edit-mode verlassen ohne zu speichern
    this.editingTopicId = null;
  }
}

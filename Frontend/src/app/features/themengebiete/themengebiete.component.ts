import { Component, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { Observable, firstValueFrom, BehaviorSubject } from 'rxjs';
import { ISubtopic } from '../../core/models/isubtopic';
import { ITopic } from '../../core/models/itopic';
import { FormsModule } from '@angular/forms';
import { take, switchMap, map, tap, of, forkJoin, catchError } from 'rxjs';

@Component({
  selector: 'app-themengebiete',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './themengebiete.component.html',
  styleUrl: './themengebiete.component.scss'
})
export class ThemengebieteComponent {
  topicId!: string;
  themengebietName: string = '';
  unterthemen$ = new BehaviorSubject<ISubtopic[]>([]);
  activeMenuId: string | null = null;
  hoveredId: string | null = null;

  showAddSubtopicInput: boolean = false;
  newSubtopicName: string = '';
  newSubtopicDescription: string = '';

  editingSubtopicId: string | null = null;
  editedSubtopicName: string = '';
  editedSubtopicDescription: string = '';

  searchQuery: string = '';
  sortCriteria: string = 'name';

  constructor(
    private route: ActivatedRoute,
    private service: GetDataService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.topicId = this.route.snapshot.paramMap.get('topicId') || '';

    this.service.getSingleTopic(this.topicId).subscribe((thema: ITopic | undefined) => {
      if (thema) {
        this.themengebietName = thema.name;
        this.service.getSubtopics(this.topicId).subscribe(subtopics => {
          this.unterthemen$.next(subtopics);
        });
      }
    });
  }

  applyFilters(): ISubtopic[] {
    return this.unterthemen$.value
      .filter(subtopic => subtopic.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      .sort((a, b) => {
        switch (this.sortCriteria) {
          case 'id-asc':
            return parseInt(a.id, 10) - parseInt(b.id, 10);
          case 'id-desc':
            return parseInt(b.id, 10) - parseInt(a.id, 10);
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }
  
  updateSortOption(event: Event) {
    this.sortCriteria = (event.target as HTMLSelectElement).value;
  }

  navigateToUnterthema(subtopicId: string, event: MouseEvent) {
    if ((event.target as HTMLElement).tagName === 'BUTTON' || (event.target as HTMLElement).tagName === 'INPUT' || (event.target as HTMLElement).tagName === 'TEXTAREA') {
      return;
    }
    this.router.navigate([subtopicId], { relativeTo: this.route });
  }

  async addSubtopic(): Promise<void> {
    if (!this.newSubtopicName.trim()) return;
  
    const newId = await firstValueFrom(this.generateNextSubtopicId());
    const newSubtopic: ISubtopic = {
      id: newId,
      name: this.newSubtopicName.trim(),
      description: this.newSubtopicDescription.trim(),
      flashcards: [] // 🟢 Neu: Initialisiere das Unterthema mit einer leeren Flashcard-Liste!
    };
  
    await firstValueFrom(this.service.addSubtopic(this.topicId, newSubtopic));
  
    this.ngZone.run(() => {
      this.unterthemen$.next([...this.unterthemen$.value, newSubtopic]);
      this.newSubtopicName = '';
      this.newSubtopicDescription = '';
      this.showAddSubtopicInput = false;
    });
  }
  

  private generateNextSubtopicId(): Observable<string> {
    return this.service.getSubtopics(this.topicId).pipe(
      map(subtopics => {
        if (!subtopics || subtopics.length === 0) {
          return '1';
        }

        const validIds = subtopics
          .map(sub => parseInt(sub.id, 10))
          .filter(n => !isNaN(n) && n > 0);

        const maxId = validIds.length > 0 ? Math.max(...validIds) : 0;
        return (maxId + 1).toString();
      })
    );
  }

  toggleMenu(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  startEditing(subtopic: ISubtopic, event: MouseEvent): void {
    event.stopPropagation();
    this.editingSubtopicId = subtopic.id;
    this.editedSubtopicName = subtopic.name;
    this.editedSubtopicDescription = subtopic.description || '';
  }

  async saveSubtopic(): Promise<void> {
    if (!this.editingSubtopicId || !this.editedSubtopicName.trim()) return;

    try {
      const updatedSubtopic: Partial<ISubtopic> = {
        name: this.editedSubtopicName.trim(),
        description: this.editedSubtopicDescription.trim()
      };

      await firstValueFrom(this.service.updateSubtopic(this.topicId, this.editingSubtopicId, updatedSubtopic));
      this.unterthemen$.next(
        this.unterthemen$.value.map(sub =>
          sub.id === this.editingSubtopicId ? { ...sub, ...updatedSubtopic } : sub
        )
      );
      this.editingSubtopicId = null;
    } catch (err) {
      console.error('❌ Fehler beim Bearbeiten:', err);
    }
  }

  loeschen(subtopicId: string, event: MouseEvent) {
    event.stopPropagation();

    if (!subtopicId) {
      console.error('❌ Fehler: Unterthema-ID ist undefined oder leer!');
      return;
    }

    if (!confirm('❗ Soll dieses Unterthema und alle verbundenen Karteikarten wirklich gelöscht werden?')) return;

    this.service.getFlashcards(this.topicId, subtopicId).pipe(
      take(1),
      switchMap(flashcards => {
        if (!flashcards || flashcards.length === 0) {
          return this.service.deleteSubtopic(this.topicId, subtopicId);
        }

        console.log(`🗑 Lösche ${flashcards.length} Flashcards vor dem Löschen des Unterthemas...`);

        const deleteRequests = flashcards.map(card => this.service.deleteFlashcard(this.topicId, subtopicId, card.id));

        return forkJoin(deleteRequests).pipe(
          switchMap(() => this.service.deleteSubtopic(this.topicId, subtopicId))
        );
      }),
      tap(() => {
        this.ngZone.run(() => {
          this.unterthemen$.next(this.unterthemen$.value.filter(sub => sub.id !== subtopicId));
          this.activeMenuId = null;
        });
        console.log(`✅ Unterthema ${subtopicId} wurde gelöscht!`);
      }),
      catchError(err => {
        console.error('❌ Fehler beim Löschen des Unterthemas:', err);
        return of(null);
      })
    ).subscribe();
  }

  cancelEditing(): void {
    this.editingSubtopicId = null;
  }

  closeMenu(): void {
    this.activeMenuId = null;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

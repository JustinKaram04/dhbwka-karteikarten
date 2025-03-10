import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { Observable, BehaviorSubject, combineLatest, firstValueFrom, of, forkJoin } from 'rxjs';
import { ITopic } from '../../core/models/itopic';
import { map, switchMap, tap, take } from 'rxjs/operators';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  themengebiete$: Observable<ITopic[]>;
  filteredThemengebiete$: Observable<ITopic[]>;
  searchTerm$ = new BehaviorSubject<string>('');
  sortOption$ = new BehaviorSubject<string>('');

  hoveredId: string | null = null;
  activeMenuId: string | null = null;
  showAddTopicInput: boolean = false;
  newTopicName: string = '';
  newTopicDescription: string = '';
  isAddingTopic: boolean = false;

  editingTopicId: string | null = null;
  editedTopicName: string = '';
  editedTopicDescription: string = '';

  constructor(private themenService: GetDataService, private router: Router) {
    this.themengebiete$ = this.themenService.getTopics();

    this.filteredThemengebiete$ = combineLatest([
      this.themengebiete$,
      this.searchTerm$,
      this.sortOption$
    ]).pipe(
      map(([topics, searchTerm, sortOption]) => this.sortTopics(
        topics.filter(topic =>
          topic.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), sortOption))
    );
  }

  private sortTopics(topics: ITopic[], sortOption: string): ITopic[] {
    switch (sortOption) {
      case 'id-asc':
        return topics.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
      case 'id-desc':
        return topics.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
      case 'name-asc':
        return topics.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return topics.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return topics;
    }
  }

  updateSearchTerm(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.searchTerm$.next(target.value);
    }
  }

  updateSortOption(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.sortOption$.next(target.value);
    }
  }

  navigateToThemengebiet(topicId: string, event: MouseEvent): void {
    if ((event.target as HTMLElement).tagName === 'BUTTON' ||
        (event.target as HTMLElement).tagName === 'INPUT' ||
        (event.target as HTMLElement).tagName === 'TEXTAREA') {
      return;
    }
    this.router.navigate(['/themengebiet', topicId]);
  }

  toggleMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  startEditing(topic: ITopic, event: MouseEvent): void {
    event.stopPropagation();
    this.editingTopicId = topic.id;
    this.editedTopicName = topic.name;
    this.editedTopicDescription = topic.description || '';
  }

  async saveTopic(): Promise<void> {
    if (!this.editingTopicId || this.editedTopicName.trim() === '') {
      console.warn('⚠️ Kein gültiger Name eingegeben – Bearbeitung abgebrochen!');
      return;
    }

    try {
      const currentTopic = await firstValueFrom(this.themenService.getSingleTopic(this.editingTopicId));
      if (!currentTopic) {
        console.error('❌ Fehler: Thema nicht gefunden!');
        return;
      }

      const updatedTopic: Partial<ITopic> = {
        name: this.editedTopicName.trim(),
        description: this.editedTopicDescription.trim(),
        subtopics: currentTopic.subtopics
      };

      await firstValueFrom(this.themenService.updateTopic(this.editingTopicId, updatedTopic));
      this.editingTopicId = null;
    } catch (err) {
      console.error('❌ Fehler beim Bearbeiten:', err);
    }
  }

  async loeschen(id: string, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    if (!confirm('❗ Soll dieses Thema mit allen Unterthemen & Flashcards wirklich gelöscht werden?')) return;

    try {
      await firstValueFrom(
        this.themenService.getSingleTopic(id).pipe(
          take(1),
          switchMap(topic => {
            if (!topic) throw new Error(`Thema ${id} nicht gefunden!`);
            console.log(`🗑 Lösche ${topic.subtopics.length} Unterthemen...`);
            const subtopicDeleteRequests = topic.subtopics.map(subtopic =>
              this.themenService.deleteSubtopic(id, subtopic.id)
            );
            return subtopicDeleteRequests.length > 0
              ? forkJoin(subtopicDeleteRequests)
              : of(null);
          }),
          switchMap(() => this.themenService.deleteTopic(id)),
          tap(() => {
            console.log(`✅ Thema ${id} mit allen Unterthemen gelöscht!`);
            this.activeMenuId = null;
          })
        )
      );
    } catch (err) {
      console.error('❌ Fehler beim Löschen:', err);
    }
  }

  cancelEditing(): void {
    this.editingTopicId = null;
  }

  async addTopic(): Promise<void> {
    if (this.isAddingTopic) return;
    if (!this.newTopicName || this.newTopicName.trim() === '') {
      return;
    }
    this.isAddingTopic = true;
    const trimmedName = this.newTopicName.trim();
    const trimmedDescription = this.newTopicDescription.trim();
    this.newTopicName = '';
    this.newTopicDescription = '';
    try {
      const newId = await firstValueFrom(this.generateNextId());
      const newTopic: ITopic = {
        id: newId,
        name: trimmedName,
        description: trimmedDescription,
        subtopics: []
      };
      await firstValueFrom(this.themenService.addTopic(newTopic));
      this.showAddTopicInput = false;
    } catch (err) {
      console.error('❌ Fehler beim Hinzufügen:', err);
    } finally {
      this.isAddingTopic = false;
    }
  }

  private generateNextId(): Observable<string> {
    return this.themenService.getTopics().pipe(
      take(1),
      map(topics => {
        if (!topics || topics.length === 0) {
          return '1';
        }
        const validIds = topics.map(t => parseInt(t.id, 10)).filter(n => !isNaN(n) && n > 0);
        const maxId = validIds.length > 0 ? Math.max(...validIds) : 0;
        return (maxId + 1).toString();
      })
    );
  }

  closeMenu(): void {
    this.activeMenuId = null;
  }
}

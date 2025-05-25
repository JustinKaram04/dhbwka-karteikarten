import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { Observable, firstValueFrom, forkJoin, of } from 'rxjs';
import { ITopic } from '../../core/models/itopic';
import { map, switchMap, tap, take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-themengebiete',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './themengebiete.component.html',
  styleUrls: ['./themengebiete.component.scss']
})
export class ThemengebieteComponent implements OnInit {
  topics$!: Observable<ITopic[]>;
  filteredTopics$!: Observable<ITopic[]>;

  searchQuery: string = '';
  sortCriteria: string = 'name';

  hoveredId: string | null = null;
  activeMenuId: string | null = null;
  showAddTopicInput: boolean = false;
  isAddingTopic: boolean = false;

  newTopicName: string = '';
  newTopicDescription: string = '';

  editingTopicId: string | null = null;
  editedTopicName: string = '';
  editedTopicDescription: string = '';

  constructor(private themenService: GetDataService, private router: Router) {}

  ngOnInit(): void {
    this.topics$ = this.themenService.getTopics();
    this.filteredTopics$ = this.applyFilters();
  }

  applyFilters(): Observable<ITopic[]> {
    return this.topics$.pipe(
      map(topics => {
        let filtered = topics;
        if (this.searchQuery.trim()) {
          filtered = filtered.filter(topic =>
            topic.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        }
        return this.sortTopics(filtered, this.sortCriteria);
      })
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

  updateSearchQuery(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.filteredTopics$ = this.applyFilters();
  }

  updateSortCriteria(event: Event): void {
    this.sortCriteria = (event.target as HTMLSelectElement).value;
    this.filteredTopics$ = this.applyFilters();
  }

  navigateToTopic(topicId: string, event: MouseEvent): void {
    const blockedTags = ['BUTTON', 'INPUT', 'TEXTAREA'];
    if (blockedTags.includes((event.target as HTMLElement).tagName)) return;
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
    if (!this.editingTopicId || !this.editedTopicName.trim()) {
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
      this.filteredTopics$ = this.applyFilters();
    } catch (err) {
      console.error('❌ Fehler beim Bearbeiten:', err);
    }
  }

  async deleteTopic(id: string, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    if (!confirm('❗ Soll dieses Thema mit allen Unterthemen & Flashcards wirklich gelöscht werden?')) return;
    try {
      await firstValueFrom(
        this.themenService.getSingleTopic(id).pipe(
          take(1),
          switchMap(topic => {
            if (!topic) throw new Error(`Thema ${id} nicht gefunden!`);
            const subtopicDeleteRequests = topic.subtopics.map(sub =>
              this.themenService.deleteSubtopic(id, sub.id)
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
      this.filteredTopics$ = this.applyFilters();
    } catch (err) {
      console.error('❌ Fehler beim Löschen:', err);
    }
  }

  cancelEditing(): void {
    this.editingTopicId = null;
  }

  async addTopic(): Promise<void> {
    if (this.isAddingTopic || !this.newTopicName.trim()) return;
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
      this.filteredTopics$ = this.applyFilters();
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
        if (!topics || topics.length === 0) return '1';
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

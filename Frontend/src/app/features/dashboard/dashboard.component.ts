import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { Observable, firstValueFrom } from 'rxjs';
import { ITopic } from '../../core/models/itopic';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  themengebiete$: Observable<ITopic[]>; 
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
  }

  navigateToThemengebiet(topicId: string, event: MouseEvent): void {
    if ((event.target as HTMLElement).tagName === 'BUTTON' || (event.target as HTMLElement).tagName === 'INPUT' || (event.target as HTMLElement).tagName === 'TEXTAREA') {
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
    console.log('✅ Thema erfolgreich aktualisiert:', updatedTopic);
    this.editingTopicId = null; 
  } catch (err) {
    console.error('❌ Fehler beim Bearbeiten:', err);
  }
}

  loeschen(id: string, event: MouseEvent): void {
    event.stopPropagation();
    if (!confirm('❗ Soll dieses Thema wirklich gelöscht werden?')) return;

    this.themenService.deleteTopic(id).subscribe({
      next: () => {
        console.log(`✅ Thema ${id} erfolgreich gelöscht`);
        this.activeMenuId = null;
      },
      error: err => console.error('❌ Fehler beim Löschen:', err)
    });
  }

  cancelEditing(): void {
    this.editingTopicId = null;
  }

  async addTopic(): Promise<void> {
    if (this.isAddingTopic) return; 

    if (!this.newTopicName || this.newTopicName.trim() === '') {
      console.warn('⚠️ Kein gültiger Name eingegeben – Abbruch!');
      return;
    }

    this.isAddingTopic = true;
    const trimmedName = this.newTopicName.trim();
    const trimmedDescription = this.newTopicDescription.trim();
    this.newTopicName = '';
    this.newTopicDescription = '';

    console.log(`🆕 Erstelle neues Thema: ${trimmedName}`);

    try {
      const newId = await firstValueFrom(this.generateNextId()); 
      const newTopic: ITopic = {
        id: newId,
        name: trimmedName,
        description: trimmedDescription, 
        subtopics: []
      };

      console.log('📡 Senden an Datenbank:', newTopic);

      await firstValueFrom(this.themenService.addTopic(newTopic)); 
      console.log('✅ Neues Thema erfolgreich gespeichert:', newTopic);
      this.showAddTopicInput = false;
    } catch (err) {
      console.error('❌ Fehler beim Hinzufügen:', err);
    } finally {
      this.isAddingTopic = false;
    }
  }

  private generateNextId(): Observable<string> {
    return this.themenService.getTopics().pipe(
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

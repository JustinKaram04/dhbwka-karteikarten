import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { Observable, firstValueFrom } from 'rxjs';
import { ISubtopic } from '../../core/models/isubtopic';
import { ITopic } from '../../core/models/itopic';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';

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
  unterthemen$: Observable<ISubtopic[]> | null = null;
  activeMenuId: string | null = null;
  hoveredId: string | null = null;

  showAddSubtopicInput: boolean = false;
  newSubtopicName: string = '';
  newSubtopicDescription: string = '';

  editingSubtopicId: string | null = null;
  editedSubtopicName: string = '';
  editedSubtopicDescription: string = '';

  constructor(private route: ActivatedRoute, private service: GetDataService, private router: Router) {}

  ngOnInit() {
    this.topicId = this.route.snapshot.paramMap.get('topicId') || '';

    this.service.getSingleTopic(this.topicId).subscribe((thema: ITopic | undefined) => {
      if (thema) {
        this.themengebietName = thema.name;
        this.unterthemen$ = this.service.getSubtopics(this.themengebietName);
      }
    });
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
    description: this.newSubtopicDescription.trim()
  };

  await firstValueFrom(this.service.addSubtopic(this.topicId, newSubtopic));
  this.newSubtopicName = '';
  this.newSubtopicDescription = '';
  this.showAddSubtopicInput = false;
}

private generateNextSubtopicId(): Observable<string> {
  return this.service.getSubtopics(this.themengebietName).pipe(
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
    this.editingSubtopicId = null;
  } catch (err) {
    console.error('❌ Fehler beim Bearbeiten:', err);
  }
}
  loeschen(id: string, event: MouseEvent) {
    event.stopPropagation();
    if (!confirm('❗ Soll dieses Unterthema wirklich gelöscht werden?')) return;
    this.service.deleteSubtopic(this.topicId, id).subscribe();
  }

  cancelEditing(): void {
    this.editingSubtopicId = null;
  }

  closeMenu(): void {
    this.activeMenuId = null;
  }
}

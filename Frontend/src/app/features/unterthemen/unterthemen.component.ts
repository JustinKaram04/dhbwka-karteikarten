import { Component, NgZone } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { Observable } from 'rxjs';
import { IFlashcard } from '../../core/models/iflashcard';
import { FormsModule } from '@angular/forms';
import { AddFlashcardComponent } from "../../features/flashcards/components/add-flashcard/add-flashcard.component";

@Component({
  selector: 'app-unterthemen',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterOutlet, FormsModule, AddFlashcardComponent],
  templateUrl: './unterthemen.component.html',
  styleUrls: ['./unterthemen.component.css']
})
export class UnterthemenComponent {
  topicId!: string;
  subtopicId!: string;
  flashcards$: Observable<IFlashcard[]> | null = null;
  editingFlashcardId: string | null = null;
  activeMenuId: string | null = null;
  hoveredId: string | null = null;

  constructor(private route: ActivatedRoute, private service: GetDataService, private router: Router) {}

  ngOnInit() {
    // Beide Parameter aus der URL extrahieren: topicId und subtopicId
    this.topicId = this.route.snapshot.paramMap.get('topicId') || '';
    this.subtopicId = this.route.snapshot.paramMap.get('subtopicId') || '';

    console.log("🔍 Topic-ID aus URL:", this.topicId);
    console.log("🔍 Unterthema-ID aus URL:", this.subtopicId);

    if (this.topicId && this.subtopicId) {
      // Den Service mit beiden Parametern aufrufen
      this.flashcards$ = this.service.getFlashcards(this.topicId, this.subtopicId);
    }
  }

  openLernmodus() {
    this.router.navigate(['lernmodus'], { relativeTo: this.route });
  }

  goBack(): void {
    this.router.navigate(['/1', this.topicId]);
  }
}

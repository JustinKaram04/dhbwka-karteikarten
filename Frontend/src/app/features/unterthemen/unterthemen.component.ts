import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { Observable } from 'rxjs';
import { IFlashcard } from '../../core/models/iflashcard';

@Component({
  selector: 'app-unterthemen',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterOutlet],
  templateUrl: './unterthemen.component.html',
  styleUrls: ['./unterthemen.component.css']  // aktualisiert: styleUrls statt styleUrl
})
export class UnterthemenComponent {
  topicId!: string;
  subtopicId!: string;
  flashcards$: Observable<IFlashcard[]> | null = null;

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
}

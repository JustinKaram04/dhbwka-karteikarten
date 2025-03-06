import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { Observable } from 'rxjs';
import { ISubtopic } from '../../core/models/isubtopic';
import { ITopic } from '../../core/models/itopic';
import { IFlashcard } from '../../core/models/iflashcard';
@Component({
  selector: 'app-unterthemen',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './unterthemen.component.html',
  styleUrl: './unterthemen.component.css'
})
export class UnterthemenComponent {
  subtopicId!: string;
  flashcards$: Observable<IFlashcard[]> | null = null;

  constructor(private route: ActivatedRoute, private service: GetDataService) {}

  ngOnInit() {
    this.subtopicId = this.route.snapshot.paramMap.get('subtopicId') || '';

    console.log("🔍 Unterthema-ID aus URL:", this.subtopicId); // DEBUGGING

    if (this.subtopicId) {
      this.flashcards$ = this.service.getFlashcards(this.subtopicId);
    }
  }
}

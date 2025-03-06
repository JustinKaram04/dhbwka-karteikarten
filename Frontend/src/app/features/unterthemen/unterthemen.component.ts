import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { CommonModule } from '@angular/common';
import { IFlashcard } from '../../core/models/iflashcard';
import { Observable, of } from 'rxjs';
import { HeaderComponent } from '../../shared/generalComponents/header/header.component';
import { SidebarComponent } from '../../shared/generalComponents/sidebar/sidebar.component';
import { FlashcardPreviewComponent } from '../flashcard-preview/flashcard-preview.component';
@Component({
  selector: 'app-unterthemen',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './unterthemen.component.html',
  styleUrl: './unterthemen.component.css'
})
export class UnterthemenComponent {
  unterthemaId!: string;
  karteikarten$!: Observable<IFlashcard[]>;

  constructor(private route: ActivatedRoute, private service: GetDataService) {}

  ngOnInit() {
    
    this.unterthemaId = String(this.route.snapshot.paramMap.get('unterthemaId'));

    this.karteikarten$ = this.service.getFlashcards(this.unterthemaId);
  };
}
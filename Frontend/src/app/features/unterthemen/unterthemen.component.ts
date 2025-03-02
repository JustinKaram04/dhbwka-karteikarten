import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { CommonModule } from '@angular/common';
import { IFlashcard } from '../../core/models/iflashcard';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-unterthemen',
  standalone: true,
  imports: [CommonModule],
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

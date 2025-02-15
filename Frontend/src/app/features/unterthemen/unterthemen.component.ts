import { Component } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { KarteikartenService } from '../../core/services/karteikarten.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-unterthemen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unterthemen.component.html',
  styleUrl: './unterthemen.component.css'
})
export class UnterthemenComponent {
  themengebietId!: number; 
  unterthemaId!: number;
  karteikarten: any[] = [];

  constructor(private route: ActivatedRoute, private service: KarteikartenService) {}

  ngOnInit() {
    this.themengebietId = Number(this.route.snapshot.paramMap.get('id')); // 🔹 Die ID wird aus der URL gelesen
    this.unterthemaId = Number(this.route.snapshot.paramMap.get('unterthemaId'));

    this.service.getKarteikarten(this.themengebietId, this.unterthemaId).subscribe(data => {
      this.karteikarten = data;
    });
  }
}

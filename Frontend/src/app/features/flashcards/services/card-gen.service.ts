import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flashcard } from './card';

@Injectable({
  providedIn: 'root'
})
export class FlashGenService {
  private jsonUrl = 'assets/cards.json'; // Pfad zur JSON-Datei

  constructor(private http: HttpClient) {}

  // Methode zum Abrufen der Karteikarten
  getFlashcards(): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(this.jsonUrl);
  }
}

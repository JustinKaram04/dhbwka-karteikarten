import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flashcard } from './features/flashcards/components/Flashcard';

@Injectable({
  providedIn: 'root',
})
export class FlashcardService {
  private jsonUrl = 'http://localhost:3000/Flashcard';

  constructor(private http: HttpClient) {}

  getFlashcards(): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(this.jsonUrl);
  }

  safeFlashcard(newFlashcard: Flashcard): Observable<Flashcard> {
    return this.http.post<Flashcard>(this.jsonUrl, newFlashcard);
  }
}

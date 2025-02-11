import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flashcard } from '../components/Flashcard';

@Injectable({
  providedIn: 'root',
})
export class SafeFlashcardService {
  private jsonUrl = 'assets/Flashcards.json'; // Backend or JSON Server URL

  constructor(private http: HttpClient) {}

  // Fetch all flashcards
  getFlashcards(): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(this.jsonUrl);
  }

  // Save a new flashcard (renamed to `safeFlashcard`)
  safeFlashcard(newFlashcard: Flashcard): Observable<Flashcard> {
    return this.http.post<Flashcard>(this.jsonUrl, newFlashcard);
  }
}
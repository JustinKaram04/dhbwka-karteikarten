import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Flashcard } from './features/flashcards/components/Flashcard';

@Injectable({
  providedIn: 'root',
})
export class FlashcardService {
  private jsonUrl = 'http://localhost:3000/Flashcards';

  constructor(private http: HttpClient) {}

  getFlashcards(): Observable<Flashcard[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map((response) => {
        // If response is an object with a "results" property, extract it
        if (response && response.results) {
          return response.results;
        }
        // If response is already an array, return it as-is
        if (Array.isArray(response)) {
          return response;
        }
        // If response is a single object, wrap it in an array
        return [response];
      })
    );
  }

  safeFlashcard(newFlashcard: Flashcard): Observable<Flashcard> {
    return this.http.post<Flashcard>(this.jsonUrl, newFlashcard);
  }
}

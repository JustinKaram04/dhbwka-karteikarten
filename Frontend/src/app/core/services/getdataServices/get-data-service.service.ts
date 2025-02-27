import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flashcard } from '../../models/Karteikarte';

@Injectable({
  providedIn: 'root',
})
export class GetDataServiceService {
  private baseURL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}


  getTopics(): Observable<string[]> {
    const topicsUrl = `${this.baseURL}/Topics`;
    return this.http.get<string[]>(topicsUrl);
  }

  get

  getFlashcards(): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(this.baseURL);
  }

  safeFlashcard(newFlashcard: Flashcard): Observable<Flashcard> {
    return this.http.post<Flashcard>(this.baseURL, newFlashcard);
  }
}

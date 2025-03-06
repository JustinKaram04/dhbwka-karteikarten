import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITopic } from '../../models/itopic';
import { ISubtopic } from '../../models/isubtopic';
import { IFlashcard } from '../../models/iflashcard';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  private baseURL = 'http://localhost:3000/';
  private topicURL = `${this.baseURL}topics`;

  private topicListSubject = new BehaviorSubject<ITopic[]>([]);
  public topicList$ = this.topicListSubject.asObservable(); // Öffentliches Observable für Themen

  constructor(private http: HttpClient) {
    this.loadTopics();
  }

  /**
   * Lädt die Themen aus der API und speichert sie im BehaviorSubject
   */
  private loadTopics(): void {
    this.http.get<ITopic[]>(this.topicURL).subscribe(topics => {
      this.topicListSubject.next(topics);
    });
  }

  /**
   * Gibt alle Themenbereiche als Observable zurück
   */
  getTopics(): Observable<ITopic[]> {
    return this.http.get<ITopic[]>(this.topicURL);
  }

  /**
   * Gibt alle Themen-Namen als Observable zurück
   */
  getTopicNames(): Observable<string[]> {
    return this.topicList$.pipe(
      map(topics => topics.map(topic => topic.name))
    );
  }

  /**
   * Holt ein einzelnes Thema anhand der ID
   * @param id - Die ID des gesuchten Themas
   * @returns Observable mit dem gefundenen Thema oder `undefined`
   */
  getSingleTopic(id: string): Observable<ITopic | undefined> {
    return this.topicList$.pipe(
      map(topics => topics.find(topic => topic.id === id))
    );
  }

  /**
   * Gibt alle Unterthemen für ein bestimmtes Thema zurück
   * @param topicName - Name des Themas
   * @returns Observable mit der Liste der Unterthemen
   */
  getSubtopics(topicName: string): Observable<ISubtopic[]> {
    return this.topicList$.pipe(
      map(topics => {
        const topic = topics.find(t => t.name === topicName);
        return topic ? topic.subtopics : [];
      })
    );
  }

  /**
   * Holt die Flashcards für ein bestimmtes Unterthema
   * @param subtopicId - ID des Unterthemas
   * @returns Observable mit der Liste der Flashcards
   */
  getFlashcards(subtopicId: string): Observable<IFlashcard[]> {
  
    return this.http.get<IFlashcard[]>(`${this.baseURL}flashcards`).pipe(
      map(flashcards => {
        const filteredCards = flashcards.filter(card => card.subtopic === subtopicId);
        return filteredCards;
      })
    );
  }
  
}

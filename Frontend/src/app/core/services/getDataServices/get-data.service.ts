import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITopic } from '../../models/itopic';
import { ISubtopic } from '../../models/isubtopic';
import { IFlashcard } from '../../models/iflashcard';
import { switchMap, map, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  private baseURL = 'http://localhost:3000/';
  private topicsURL = `${this.baseURL}topics`;
  private flashcardsURL = `${this.baseURL}flashcards`;

  private topicListSubject = new BehaviorSubject<ITopic[]>([]);
  public topicList$ = this.topicListSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTopics();
  }

  /** 🔄 Themenbereiche aus API laden */
  private loadTopics(): void {
    this.http.get<ITopic[]>(this.topicsURL).subscribe(topics => {
      this.topicListSubject.next(topics);
    });
  }

  /** 📥 Alle Themen abrufen */
  getTopics(): Observable<ITopic[]> {
    return this.topicList$;
  }

  getSingleTopic(id: string): Observable<ITopic | undefined> {
    return this.topicList$.pipe(
      map(topics => topics.find(topic => topic.id === id))
    );
  }

  /** 📌 Neuen Themenbereich hinzufügen (POST) */
  addTopic(newTopic: ITopic): Observable<ITopic> {
    return this.http.post<ITopic>(this.topicsURL, newTopic).pipe(
      tap(() => this.loadTopics()) 
    );
  }
  

  /** ✏ Ein bestehendes Thema aktualisieren (PUT) */
/** ✏ Ein bestehendes Thema aktualisieren (PUT) */
updateTopic(topicId: string, updatedTopic: Partial<ITopic>): Observable<ITopic> {
  return this.getSingleTopic(topicId).pipe(
    map(existingTopic => ({
      ...existingTopic, // Alle bestehenden Daten behalten
      ...updatedTopic  // Neue Daten überschreiben
    })),
    switchMap(finalTopic => this.http.put<ITopic>(`${this.topicsURL}/${topicId}`, finalTopic)),
    tap(() => this.loadTopics())
  );
}


  /** ❌ Thema löschen (DELETE) */
  deleteTopic(topicId: string): Observable<void> {
    return this.http.delete<void>(`${this.topicsURL}/${topicId}`).pipe(
      tap(() => {
        const updatedTopics = this.topicListSubject.value.filter(t => t.id !== topicId);
        this.topicListSubject.next(updatedTopics);
      })
    );
  }

getSubtopics(topicName: string): Observable<ISubtopic[]> {
  return this.http.get<ITopic[]>(this.topicsURL).pipe(
    map(topics => {
      const topic = topics.find(t => t.name === topicName);
      return topic ? topic.subtopics : [];
    })
  );
}

  /** 📌 Neues Unterthema hinzufügen (POST) */
  addSubtopic(topicId: string, newSubtopic: ISubtopic): Observable<ISubtopic> {
    return this.getTopics().pipe(
      map(topics => {
        const topic = topics.find(t => t.id === topicId);
        if (topic) {
          topic.subtopics.push(newSubtopic);
          this.updateTopic(topicId, topic).subscribe(); // Thema mit neuem Unterthema speichern
        }
        return newSubtopic;
      })
    );
  }

  /** ✏ Ein Unterthema aktualisieren (PUT) */
  updateSubtopic(topicId: string, subtopicId: string, updatedSubtopic: Partial<ISubtopic>): Observable<ISubtopic> {
    return this.getTopics().pipe(
      map(topics => {
        const topic = topics.find(t => t.id === topicId);
        if (topic) {
          topic.subtopics = topic.subtopics.map(sub =>
            sub.id === subtopicId ? { ...sub, ...updatedSubtopic } : sub
          );
          this.updateTopic(topicId, topic).subscribe(); // Thema mit aktualisiertem Unterthema speichern
        }
        return updatedSubtopic as ISubtopic;
      })
    );
  }

  /** ❌ Unterthema löschen (DELETE) */
  deleteSubtopic(topicId: string, subtopicId: string): Observable<void> {
    return this.getTopics().pipe(
      map(topics => {
        const topic = topics.find(t => t.id === topicId);
        if (topic) {
          topic.subtopics = topic.subtopics.filter(sub => sub.id !== subtopicId);
          this.updateTopic(topicId, topic).subscribe();
        }
      })
    );
  }

  /** 📥 Alle Flashcards für ein Unterthema */
  getFlashcards(subtopicId: string): Observable<IFlashcard[]> {
    return this.http.get<IFlashcard[]>(this.flashcardsURL).pipe(
      map(flashcards => flashcards.filter(card => card.subtopic === subtopicId))
    );
  }

  /** 📌 Neue Flashcard hinzufügen (POST) */
  addFlashcard(newFlashcard: IFlashcard): Observable<IFlashcard> {
    return this.http.post<IFlashcard>(this.flashcardsURL, newFlashcard);
  }

  /** ✏ Flashcard aktualisieren (PUT) */
  updateFlashcard(flashcardId: string, updatedFlashcard: Partial<IFlashcard>): Observable<IFlashcard> {
    return this.http.put<IFlashcard>(`${this.flashcardsURL}/${flashcardId}`, updatedFlashcard);
  }

  /** ❌ Flashcard löschen (DELETE) */
  deleteFlashcard(flashcardId: string): Observable<void> {
    return this.http.delete<void>(`${this.flashcardsURL}/${flashcardId}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs';
import { ITopic } from '../../models/itopic';
import { ISubtopic } from '../../models/isubtopic';
import { IFlashcard } from '../../models/iflashcard';
import { take, switchMap, map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  private baseURL = 'http://localhost:3000/';
  private topicsURL = `${this.baseURL}topics`;

  private topicListSubject = new BehaviorSubject<ITopic[]>([]);
  public topicList$ = this.topicListSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTopics();
  }

  private loadTopics(): void {
    this.http.get<ITopic[]>(this.topicsURL).subscribe(topics => {
      this.topicListSubject.next(topics);
    });
  }

  getTopics(): Observable<ITopic[]> {
    return this.topicList$;
  }

  getSingleTopic(id: string): Observable<ITopic | undefined> {
    return this.topicList$.pipe(
      map(topics => topics.find(topic => topic.id === id))
    );
  }

  addTopic(newTopic: ITopic): Observable<ITopic> {
    return this.http.post<ITopic>(this.topicsURL, newTopic).pipe(
      tap(() => this.loadTopics())
    );
  }

  updateTopic(topicId: string, updatedTopic: Partial<ITopic>): Observable<void> {
    return this.http.put<void>(`${this.topicsURL}/${topicId}`, updatedTopic).pipe(
      tap(() => this.loadTopics())
    );
  }

  deleteTopic(topicId: string): Observable<void> {
    return this.getSingleTopic(topicId).pipe(
      take(1),
      switchMap(topic => {
        if (!topic) {
          console.error(`❌ Fehler: Thema ${topicId} nicht gefunden!`);
          return of();
        }
        console.log(`🗑 Lösche ${topic.subtopics.length} Unterthemen...`);
        const deleteSubtopics = topic.subtopics.map(sub =>
          this.deleteSubtopic(topicId, sub.id)
        );
        return deleteSubtopics.length > 0 ? forkJoin(deleteSubtopics) : of(null);
      }),
      switchMap(() => this.http.delete<void>(`${this.topicsURL}/${topicId}`)),
      tap(() => this.loadTopics())
    );
  }

  getSubtopics(topicId: string): Observable<ISubtopic[]> {
    return this.getSingleTopic(topicId).pipe(
      map(topic => topic ? topic.subtopics : [])
    );
  }

  addSubtopic(topicId: string, newSubtopic: ISubtopic): Observable<void> {
    return this.getSingleTopic(topicId).pipe(
      take(1),
      switchMap(topic => {
        if (!topic) {
          console.error(`❌ Fehler: Thema ${topicId} nicht gefunden!`);
          return of();
        }
        topic.subtopics.push({ ...newSubtopic, flashcards: [] });
        return this.updateTopic(topicId, topic);
      })
    );
  }

  updateSubtopic(topicId: string, subtopicId: string, updatedSubtopic: Partial<ISubtopic>): Observable<void> {
    return this.getSingleTopic(topicId).pipe(
      take(1),
      switchMap(topic => {
        if (!topic) {
          console.error(`❌ Fehler: Thema ${topicId} nicht gefunden!`);
          return of();
        }
        topic.subtopics = topic.subtopics.map(sub =>
          sub.id === subtopicId ? { ...sub, ...updatedSubtopic } : sub
        );
        return this.updateTopic(topicId, topic);
      })
    );
  }

  deleteSubtopic(topicId: string, subtopicId: string): Observable<void> {
    return this.getSingleTopic(topicId).pipe(
      take(1),
      switchMap(topic => {
        if (!topic) {
          console.error(`❌ Fehler: Thema ${topicId} nicht gefunden!`);
          return of();
        }
        return this.getFlashcards(topicId, subtopicId).pipe(
          take(1),
          switchMap(flashcards => {
            const deleteFlashcards = flashcards.map(card => this.deleteFlashcard(topicId, subtopicId, card.id));
            return deleteFlashcards.length > 0 ? forkJoin(deleteFlashcards) : of(null);
          }),
          switchMap(() => {
            topic.subtopics = topic.subtopics.filter(sub => sub.id !== subtopicId);
            return this.updateTopic(topicId, topic);
          })
        );
      })
    );
  }

  getFlashcards(topicId: string, subtopicId: string): Observable<IFlashcard[]> {
    return this.getSingleTopic(topicId).pipe(
      map(topic => {
        if (!topic) return [];
        const subtopic = topic.subtopics.find(st => st.id === subtopicId);
        return subtopic ? subtopic.flashcards : [];
      })
    );
  }

  addFlashcard(topicId: string, subtopicId: string, newFlashcard: IFlashcard): Observable<void> {
    return this.getSingleTopic(topicId).pipe(
      take(1),
      switchMap(topic => {
        if (!topic) {
          console.error(`❌ Fehler: Thema ${topicId} nicht gefunden!`);
          return of();
        }
        const subtopic = topic.subtopics.find(sub => sub.id === subtopicId);
        if (!subtopic) {
          console.error(`❌ Fehler: Unterthema ${subtopicId} nicht gefunden!`);
          return of();
        }
        subtopic.flashcards.push(newFlashcard);
        return this.updateTopic(topicId, topic);
      })
    );
  }

  updateFlashcard(topicId: string, subtopicId: string, flashcardId: string, updatedFlashcard: Partial<IFlashcard>): Observable<void> {
    return this.getSingleTopic(topicId).pipe(
      take(1),
      switchMap(topic => {
        if (!topic) return of();
        const subtopic = topic.subtopics.find(sub => sub.id === subtopicId);
        if (!subtopic) return of();
        subtopic.flashcards = subtopic.flashcards.map(card =>
          card.id === flashcardId ? { ...card, ...updatedFlashcard } : card
        );
        return this.updateTopic(topicId, topic);
      })
    );
  }

  deleteFlashcard(topicId: string, subtopicId: string, flashcardId: string): Observable<void> {
    return this.getSingleTopic(topicId).pipe(
      take(1),
      switchMap(topic => {
        if (!topic) return of();
        const subtopic = topic.subtopics.find(sub => sub.id === subtopicId);
        if (!subtopic) return of();
        subtopic.flashcards = subtopic.flashcards.filter(card => card.id !== flashcardId);
        return this.updateTopic(topicId, topic);
      })
    );
  }

  updateLearningProgress(topicId: string, subtopicId: string, flashcardId: string, newProgress: number): Observable<void> {
    return this.getSingleTopic(topicId).pipe(
      take(1),
      switchMap(topic => {
        if (!topic) {
          console.error(`❌ Fehler: Thema ${topicId} nicht gefunden!`);
          return of();
        }
        const subtopic = topic.subtopics.find(sub => sub.id === subtopicId);
        if (!subtopic) {
          console.error(`❌ Fehler: Unterthema ${subtopicId} nicht gefunden!`);
          return of();
        }
        subtopic.flashcards = subtopic.flashcards.map(card =>
          card.id === flashcardId ? { ...card, learningProgress: newProgress } : card
        );
        return this.updateTopic(topicId, topic);
      })
    );
  }
  // 🔹 Einzigartige ID für ein neues Thema
  generateNextTopicId(): Observable<string> {
    return this.getTopics().pipe(
      take(1),
      map(topics => {
        const maxId = topics.length > 0 ? Math.max(...topics.map(t => parseInt(t.id, 10))) : 0;
        return (maxId + 1).toString();
      })
    );
  }

  // 🔹 IDs für Unterthemen sollen bei 1 starten – pro Thema
  generateNextSubtopicId(topicId: string): Observable<string> {
    return this.getSubtopics(topicId).pipe(
      take(1),
      map(subtopics => {
        const maxId = subtopics.length > 0 ? Math.max(...subtopics.map(s => parseInt(s.id, 10))) : 0;
        return (maxId + 1).toString();
      })
    );
  }

  // 🔹 IDs für Flashcards sollen bei 1 starten – pro Unterthema
  generateNextFlashcardId(topicId: string, subtopicId: string): Observable<string> {
    return this.getFlashcards(topicId, subtopicId).pipe(
      take(1),
      map(flashcards => {
        const maxId = flashcards.length > 0 ? Math.max(...flashcards.map(f => parseInt(f.id, 10))) : 0;
        return (maxId + 1).toString();
      })
    );
  }

}
